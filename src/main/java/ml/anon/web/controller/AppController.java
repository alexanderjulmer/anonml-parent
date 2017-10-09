package ml.anon.web.controller;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.ParametersAreNonnullByDefault;
import javax.annotation.Resource;

import ml.anon.documentmanagement.model.DocumentState;
import ml.anon.documentmanagement.model.FileType;
import okhttp3.*;
import okhttp3.ResponseBody;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.java.Log;
import ml.anon.anonymization.model.Anonymization;
import ml.anon.anonymization.model.Label;
import ml.anon.documentmanagement.model.Document;
import ml.anon.documentmanagement.resource.DocumentResource;
import org.springframework.web.servlet.ModelAndView;

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
    @Value("${admin.service.url}")
    private String adminUrl;

    @Resource
    private DocumentResource documentResource;

    private RestTemplate restTemplate = new RestTemplate();


    @RequestMapping(value = {"./", "./document/{id}"}, method = RequestMethod.GET)
    public String index() {
        log.info("Index page accessed");
        return "forward:/index.html";
    }

    @RequestMapping(value = {"/overview"}, method = RequestMethod.GET)
    public ModelAndView adminOverview() {
        log.info("overview accessed");
        return new ModelAndView("redirect:" + adminUrl + "/overview");
    }

    @RequestMapping(value = {"/admin"}, method = RequestMethod.GET)
    public ModelAndView admin() {
        log.info("admin accessed");
        return new ModelAndView("redirect:" + adminUrl + "/admin");
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

    @PostMapping(value = "/api/update/anonymizations/{id}/{version}")
    public ResponseEntity<Document> updateAnonymizations(@PathVariable String id, @PathVariable String version,
                                                        @RequestBody List<Anonymization> anonymizations) {

        Document newVersion;
        FileType originalFileType = FileType.PDF;
        try {

            Document doc = documentResource.findById(id);
            originalFileType = doc.getOriginalFileType();
            doc.setAnonymizations(anonymizations);
            doc.setVersion(Integer.valueOf(version));
            newVersion = documentResource.update(id, doc);
            this.calculateFOne(id);

        } catch (Exception e) {
            log.severe(e.getLocalizedMessage());
            return ResponseEntity.ok(Document.builder().originalFileType(originalFileType).version(-1).build());
        }

        return ResponseEntity.ok(newVersion);
    }

    @GetMapping(value = "/api/save/{id}", produces = "application/zip")
    public void saveEditedFile(@PathVariable String id, HttpServletResponse response)
            throws IOException {

        log.info("export-accessed!");
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
