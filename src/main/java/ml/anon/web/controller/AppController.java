package ml.anon.web.controller;

import lombok.extern.java.Log;
import ml.anon.model.anonymization.Anonymization;
import ml.anon.model.anonymization.Label;
import ml.anon.model.docmgmt.Document;
import ml.anon.model.docmgmt.DocumentAccess;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

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


    @PostMapping("/api/save/{id}")
    public void saveEditedFile(@PathVariable String id,
                               @RequestBody List<Anonymization> anonymizations) {

        System.out.println("id: " + id);
        System.out.println("Anon count: " + anonymizations.size());

        access.updateDocument(id, anonymizations);
        restTemplate.getForObject(URI.create("http://127.0.0.1:9001/document/" + id + "/export"), null);

    }

    @GetMapping(value = "/api/labels")
    public ResponseEntity<List<Label>> getAllLabels() {
        return ResponseEntity.ok(Label.getAll());
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
