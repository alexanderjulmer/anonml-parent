package ml.anon.web.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import ml.anon.documentmanagement.model.DocumentState;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
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
import ml.anon.anonymization.model.Anonymization;
import ml.anon.anonymization.model.Label;
import ml.anon.documentmanagement.model.Document;
import ml.anon.documentmanagement.resource.DocumentResource;

import javax.servlet.http.HttpServletResponse;

/**
 * Resource that provides the index page of client application.
 */
@Controller
@Log
public class AppController {

    @Value("${documentmanagement.service.url}")
    private String documentManagementUrl;
    @Value("${rulebased.service.url}")
    private String rulebasedUrl;
    @Value("${machinelearning.service.url}")
    private String machinelearningUrl;

    @Resource
    private DocumentResource documentResource;

    private RestTemplate restTemplate = new RestTemplate();


    @RequestMapping(value = {"/", "/document/{id}"}, method = RequestMethod.GET)
    public String index() {
        log.info("Index page accessed");
        return "forward:/index.html";
    }

    @RequestMapping(value = "/api/document/{id}", method = RequestMethod.GET)
    public ResponseEntity<Document> loadDocument(@PathVariable("id") String id) {
        log.info("Pre load document!");
        Document document = documentResource.findById(id);
        if (document.getState() == DocumentState.UPLOADED) {
            log.info("Analyzing document" + id);
            document = analyzeDoc(document);
        }
        return ResponseEntity.ok(document);
    }

    @PostMapping(value = "/api/update/anonymizations/{id}")
    public ResponseEntity<Boolean> updateAnonymizations(@PathVariable String id,
                                                        @RequestBody List<Anonymization> anonymizations) {
        try {

            Document doc = documentResource.findById(id);
            doc.setAnonymizations(anonymizations);
            documentResource.update(id, doc);

        } catch (Exception e) {
            log.severe(e.getLocalizedMessage());
        }

        return ResponseEntity.ok(true);
    }

    @GetMapping(value = "/api/save/{id}", produces = "application/zip")
    public void saveEditedFile(@PathVariable String id, HttpServletResponse response)
            throws IOException {

        System.out.println("export-accessed!");

        this.calculateFOne(id);
        this.updateTrainingData(id);

        URI url = URI.create(documentManagementUrl + "/document/" + id + "/export");

        OkHttpClient client = new OkHttpClient();
        Request req = new Request.Builder().url(HttpUrl.get(url)).build();
        Response execute = client.newCall(req).execute();
        ResponseBody body = execute.body();
        execute.headers();
        response.setContentType("application/zip");
        response.addHeader("Content-Disposition", "attachment; filename=" + id + ".zip");
        org.apache.commons.io.IOUtils
                .copy(execute.body().source().inputStream(), response.getOutputStream());
        response.getOutputStream().flush();
    }

    private boolean calculateFOne(String documentId) {

        return restTemplate.postForObject(URI.create(machinelearningUrl + "/ml/calculate/f/one/" + documentId), null, Boolean.class);
    }

    private boolean updateTrainingData(String documentId) {
        return restTemplate.postForObject(
                URI.create(machinelearningUrl + "/ml/update/training/data/" + documentId), null,
                Boolean.class);
    }

    @GetMapping(value = "/api/labels")
    public ResponseEntity<List<Label>> getAllLabels() {
        return ResponseEntity.ok(Label.getAll());
    }

    @GetMapping(value = "/api/retrain")
    public ResponseEntity<Boolean> retrainModel() {

        ResponseEntity<Boolean> response = restTemplate
                .getForEntity(URI.create(machinelearningUrl + "/ml/retrain/"), Boolean.class);

        return ResponseEntity.ok(response.getBody());
    }


    @PostMapping("/api/upload")
    public ResponseEntity<?> callDocumentManagement(@RequestParam(value = "file") MultipartFile file)
            throws IOException {

        byte[] bytes = file.getBytes();
        Document body = documentResource.importDocument(file.getOriginalFilename(), bytes);

        body = analyzeDoc(body);

        return ResponseEntity.ok(body);


    }

    private Document analyzeDoc(Document body) {
        List<Anonymization> anonymizations = new ArrayList<>();
        try {
            anonymizations.addAll(applyRules(body));
        } catch (Exception e) {
            log.severe("RegEx Service not available");
            log.severe(e.getLocalizedMessage());
        }
        try {
            anonymizations.addAll(applyML(body));
        } catch (Exception e) {
            log.severe("ML Service not available");
            log.severe(e.getLocalizedMessage());
        }
        Document doc = documentResource.findById(body.getId());
        doc.setAnonymizations(anonymizations);
        doc.setState(DocumentState.IN_PROGRESS);
        body = documentResource.update(body.getId(), doc);
        return body;
    }

    private List<Anonymization> applyRules(Document document) {
        return restTemplate.postForObject(
                URI.create(rulebasedUrl + "/rules/annotate/" + document.getId()), null,
                ArrayList.class);

    }

    private List<Anonymization> applyML(Document document) {
        return restTemplate.postForObject(
                URI.create(machinelearningUrl + "/ml/annotate/" + document.getId()), null, ArrayList.class);

    }


}
