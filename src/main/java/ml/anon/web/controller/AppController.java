package ml.anon.web.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import okhttp3.*;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.java.Log;
import ml.anon.model.anonymization.Anonymization;
import ml.anon.model.anonymization.Label;
import ml.anon.model.docmgmt.Document;
import ml.anon.model.docmgmt.DocumentAccess;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;

/**
 * Resource that provides the index page of client application.
 */
@Controller
@Log
public class AppController {

    private DocumentAccess access = new DocumentAccess(new RestTemplate());
    private RestTemplate restTemplate = new RestTemplate();


    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        System.out.println("index page accessed!");
        return "index.html";
    }
    
    @PostMapping(value = "/api/update/anonymizations/{id}")
    public ResponseEntity<Boolean> updateAnonymizations(@PathVariable String id,  @RequestBody List<Anonymization> anonymizations){
      try {
        access.updateDocument(id, anonymizations);
        this.updateTrainingData(id);
      } catch (Exception e) {
        log.severe(e.getLocalizedMessage());
      }
      
      return ResponseEntity.ok(true);
    }
    
    @GetMapping(value = "/api/save/{id}", produces = "application/zip")
    public void saveEditedFile(@PathVariable String id, HttpServletResponse response) throws IOException{
      
      System.out.println("export-accessed!");
      URI url = URI.create("http://127.0.0.1:9001/document/" + id + "/export");

      OkHttpClient client = new OkHttpClient();
      Request req = new Request.Builder().url(HttpUrl.get(url)).build();
      Response execute = client.newCall(req).execute();
      ResponseBody body = execute.body();
      execute.headers();
      response.setContentType("application/zip");
      response.addHeader("Content-Disposition", "attachment; filename=" + id + ".zip");
      org.apache.commons.io.IOUtils.copy(execute.body().source().inputStream(), response.getOutputStream());
      response.getOutputStream().flush();
    }

    private boolean updateTrainingData(String documentId) {
        return restTemplate.postForObject(
                URI.create("http://127.0.0.1:9003/ml/update/training/data/" + documentId), null, Boolean.class);
    }

    @GetMapping(value = "/api/labels")
    public ResponseEntity<List<Label>> getAllLabels() {
        return ResponseEntity.ok(Label.getAll());
    }

    @GetMapping(value = "/api/retrain")
    public ResponseEntity<Boolean> retrainModel() {

        ResponseEntity<Boolean> response = restTemplate.getForEntity(URI.create("http://127.0.0.1:9003/ml/retrain/" + "IdOfTrainingsData"), Boolean.class);

        return ResponseEntity.ok(response.getBody());
    }


    @PostMapping("/api/upload")
    public ResponseEntity<?> callDocumentManagement(@RequestParam(value = "file") MultipartFile file)
            throws IOException {

        byte[] bytes = file.getBytes();
        String base64 = Base64Utils.encodeToString(bytes);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, "multipart/form-data");
        MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
        map.add("doc", base64);
        map.add("title", file.getOriginalFilename());
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(map, headers);

        ResponseEntity<Document> exchange = restTemplate
                .exchange("http://127.0.0.1:9001/document/import", HttpMethod.POST, entity, Document.class);
        log.info(String.valueOf(exchange));
        ResponseEntity<Document> res = exchange;

        Document body = res.getBody();


        List<Anonymization> anonymizations = new ArrayList<>();
        try {
            anonymizations.addAll(this.applyRules(body));
        } catch (Exception e) {
            log.severe("RegEx Service not available");
            log.severe(e.getLocalizedMessage());
        }
        try {
            anonymizations.addAll(this.applyML(body));
        } catch (Exception e) {
            log.severe("ML Service not available");
            log.severe(e.getLocalizedMessage());
        }

        body = access.updateDocument(body.getId(), anonymizations);

        return ResponseEntity.ok(body);


    }

    private List<Anonymization> applyRules(Document document) {
        return restTemplate.postForObject(
                URI.create("http://127.0.0.1:9002/rules/annotate/" + document.getId()), null,
                ArrayList.class);

    }

    private List<Anonymization> applyML(Document document) {
        return restTemplate.postForObject(
                URI.create("http://127.0.0.1:9003/ml/annotate/" + document.getId()), null, ArrayList.class);

    }


}
