package kr.bit.bobple.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
public class HomeController {

    @GetMapping("/index")
    public String home() {
        return "index"; // index.html 템플릿 파일 반환
    }

}
