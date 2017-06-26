package ml.anon.web.controller;

import lombok.extern.java.Log;
import ml.anon.model.anonymization.Anonymization;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;

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
  public ResponseEntity<?> saveEditedFile(@PathVariable String id,
      @RequestBody Anonymization... anonymizations) {

    System.out.println("id: " + id);
    System.out.println("Anon count: " + anonymizations.length);

    return ResponseEntity.ok("true");
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
    body = this.applyRules(body);
//    body = this.applyML(body);
    
    return ResponseEntity.ok(body);


  }

  private Document applyRules(Document document) {
    return access.updateDocument(document.getId(),
        restTemplate.postForObject(
            URI.create("http://127.0.0.1:9002/rules/annotate/" + document.getId()), null,
            ArrayList.class));

  }

  private Document applyML(Document document) {
    return access.updateDocument(document.getId(), restTemplate.postForObject(
        URI.create("http://127.0.0.1:9003/ml/annotate" + document.getId()), null, ArrayList.class));

  }

}
