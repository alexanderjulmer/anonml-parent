package ml.anon.web.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.hateoas.EntityLinks;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import ml.anon.model.docmgmt.Document;

/**
 * Resource that provides the index page of client application.
 */
@Controller
public class AppController {


  @RequestMapping(value = "/", method = RequestMethod.GET)
  public String index() {
    System.out.println("index page accessed!");
    return "index.html";
  }
  
  
  @PostMapping("/api/annotate")
  public ResponseEntity<?> callAnnotationService(@RequestParam(value = "tokenizedFile") String tokenizedFile)
      throws IOException {
    RestTemplate restTemplate = new RestTemplate();
    String url = "http://127.0.0.1:9003/ml/annotate";
    
    return restTemplate.postForObject(url, tokenizedFile, ResponseEntity.class);
  }
  
  
  

  @PostMapping("/api/upload")
  public ResponseEntity<?> callDocumentManagement(@RequestParam(value = "file") MultipartFile file)
      throws IOException {

    HttpHeaders requestHeaders = new HttpHeaders();

    // Sending multipart/form-data
    requestHeaders.setContentType(MediaType.MULTIPART_FORM_DATA);

    // populate the data to post
    MultiValueMap<String, Object> data = new LinkedMultiValueMap<String, Object>();
    data.add("name", file.getOriginalFilename());
    data.add("file", new ByteArrayResource(file.getBytes()));

    // Populate the MultiValueMap being serialized and headers in an HttpEntity object to use for
    // the request
    HttpEntity<MultiValueMap<String, Object>> requestEntity =
        new HttpEntity<MultiValueMap<String, Object>>(data, requestHeaders);

    RestTemplate restTemplate = new RestTemplate();
    restTemplate.getMessageConverters().add(new FormHttpMessageConverter());
    restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());

    // just to test it 
    String url = "http://127.0.0.1:9000/document/import";
    //String url = "http://127.0.0.1:9001/document/import";

    
    return restTemplate.exchange(url, HttpMethod.POST, requestEntity, ResponseEntity.class);
    // return restTemplate.postForObject(url, file, ResponseEntity.class);
  }

 // to test the http post method
  @RequestMapping(value = "/document/import", method = RequestMethod.POST,
      consumes = "multipart/form-data")
  public ResponseEntity<?> test(@RequestParam("doc") MultipartFile... file)
      throws IOException {

    System.out.println("accessed post ");
    System.out.println("length: " + file.length);

    for (MultipartFile multipartFile : file) {
      System.out.println(multipartFile.getName());
    }
    return ResponseEntity.ok().body("true");
  }


}
