package ml.anon.web.controller;

import lombok.extern.java.Log;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@Log
public class OwnErrorController implements ErrorController {


    private static final String PATH = "/error";

    @RequestMapping(value = PATH)
    public ModelAndView error() {
        log.info("Error - redirect indexpage");
        return new ModelAndView("redirect:/");
    }

    @Override
    public String getErrorPath() {
        return PATH;
    }
}
