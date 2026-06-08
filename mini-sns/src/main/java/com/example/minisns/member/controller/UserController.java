/**
 * 파이프라인
 * 1. service 주입받아 사용
 * 2.생성자를 통해 의존성 초기화
 * 3. get으로  Controller에서 HTML(Thymeleaf)로 데이터를 전달
 * 4. post api 처리
 * 5. api 처리 완료 후 redirect 화면으로 이동
 * */
package com.example.minisns.member.controller;

import com.example.minisns.member.dto.LoginForm;
import com.example.minisns.member.dto.SignupForm;
import com.example.minisns.member.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller // 이 파일이 controller 임을 명시
public class UserController {
    // UserService 호출하여 캡슐화(변경 불가능)
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입
    @GetMapping("/signup")
    public String signupForm(Model model) {
        // Controller에서 HTML(Thymeleaf)로 데이터를 전달
        model.addAttribute("signupForm", new SignupForm()); // 빈 SignupForm 객체를 생성해서 signupForm 이라는 이름으로 HTML에 전달
        return "signup";
    }
    // post api
    @PostMapping("/signup")
    public String signup(SignupForm form) {
        userService.signup(form); // 회원가입 처리 (db 전송)
        return "redirect:/login"; // 회원가입 성공 시 로그인 페이지 이동
    }

    // 로그인
    @GetMapping("/login")
    public String login(Model model) {
        // Controller에서 HTML(Thymeleaf)로 데이터를 전달
        model.addAttribute("loginForm", new LoginForm()); // 빈 LoginForm 객체를 생성해서 loginForm 이라는 이름으로 HTML에 전달
        return "login";
    }
    // post api
//    @PostMapping("/login")
//    public String login(LoginForm form, HttpSession session) {
//        userService.login(form); // 로그인 검증
//        session.setAttribute("loginUserId", form.getUserId()); // http 세션에 로그인 정보 저장
//        return "redirect:/"; // 로그인 성공
//    }

}
