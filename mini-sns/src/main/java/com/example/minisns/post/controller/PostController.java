/**
 * 파이프라인
 * 1. service 주입받아 사용
 * 2.생성자를 통해 의존성 초기화
 * 3. get으로  Controller에서 HTML(Thymeleaf)로 데이터를 전달
 *
 * 게시글 등록
 * 1. 게시글 작성 페이지 요청
 * 2. 빈 PostForm 객체를 create.html로 전달
 * 3. 입력한 게시글 정보 전달받기
 * 4. 로그인한 사용자 정보 조회
 * 5. Service에 게시글 저장 요청
 * 6. 저장 완료 후 피드 화면으로 이동
 *
 * 게시글 조회
 * 1. 전체 게시글 조회 요청
 * 2. Service에서 게시글 목록 조회
 * 3. 게시글 목록을 feed.html로 전달
 * 4. 로그인 사용자 정보 전달
 *
 * 내 게시글 조회
 * 1. 로그인 사용자 정보 조회
 * 2. 로그인 여부 확인
 * 3. 로그인 사용자의 게시글 조회
 * 4. 게시글 목록을 feed.html로 전달
 *
 * 게시글 삭제
 * 1. URL에서 게시글 id 추출
 * 2. 로그인 사용자 정보 조회
 * 3. Service에 게시글 삭제 요청
 * 4. 삭제 완료 후 피드 화면으로 이동
 *
 * 게시글 수정
 * 1. URL에서 게시글 id 추출
 * 2. 로그인 사용자 정보 조회
 * 3. 수정할 게시글 정보 조회
 * 4. 게시글 정보를 edit.html로 전달
 * 5. 수정된 게시글 정보 전달받기
 * 6. Service에 게시글 수정 요청
 * 7. 수정 완료 후 피드 화면으로 이동
 * */
package com.example.minisns.post.controller;

import com.example.minisns.post.dto.PostForm;
import com.example.minisns.post.entity.Post;
import com.example.minisns.post.service.PostService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.security.Principal;

@Controller // 이 파일이 cotroller임을 명시
public class PostController {
    // PostService 호출하여 캡슐화(변경 불가능)
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 게시글 등록

    @GetMapping("/create")
    public  String create(Model model) {
        // Controller에서 HTML(Thymeleaf)로 데이터를 전달
        // model.addAttribute("이름", 데이터);
        model.addAttribute("postForm", new PostForm()); // 빈 PostForm 객체를 생성해서 postForm 이라는 이름으로 HTML에 전달
        return "create";
    }
    @PostMapping("/create")
    public String create(PostForm form, Principal principal) throws IOException { // service처럼 throws IOException 해줘야 함
        String userId = principal.getName(); // 현재 로그인된 사용자 아이디 가져오기
        postService.create(form, userId); // 게시글 등록 (db 전송)
        return "redirect:/";
    }

    // 전체 게시글 조회
    @GetMapping("/")
    public String feed(Model model, Principal principal) {
        model.addAttribute("posts", postService.findAll()); // 게시글 리스트 전달

        // 현재 로그인한 사용자 정보가 있다면
        if (principal != null) {
            model.addAttribute("loginUserId", principal.getName()); // 현재 로그인되어있는 아이디값 가져오기
        }

        return "feed";
    }

    // 내 게시글 조회
    @GetMapping("/my-feed")
    public String myFeed(Model model, Principal principal) {
        String userId = principal.getName(); // 현재 로그인되어있는 아이디값 가져오기
        model.addAttribute("posts", postService.findByUserId(userId)); // 내 게시글 목록을 조회해서 posts라는 이름으로 feed.html에 전달
        model.addAttribute("loginUserId", userId); // 현재 로그인된 사용자 아이디 전달
        return "feed";
    }

    // 게시글 삭제
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id, Principal principal) { // @PathVariable : URL에 있는 {id} 값을 가져옴
        String userId = principal.getName(); // 현재 로그인되어있는 아이디값 가져오기
        postService.delete(id, userId); // 게시글 삭제 서비스를 실행
        return "redirect:/";
    }

    // 게시글 수정
    @GetMapping("/edit/{id}")
    public String edit(@PathVariable Long id, Principal principal, Model model) {
        String userId = principal.getName(); // 현재 로그인되어있는 아이디값 가져오기
        Post post = postService.findById(id, userId); // 수정할 게시글 내용 가져오기
        model.addAttribute("post", post); // 수정할 게시글 내용 가져온걸 "post"이름으로 edit.html에 전달
        return "edit";
    }

    // post api
    @PostMapping("/edit/{id}")
    public String edit(@PathVariable Long id, PostForm form, Principal principal) {
        String userId = principal.getName(); // 현재 로그인되어있는 아이디값 가져오기
        postService.edit(form, id, userId); // 게시글 수정 서비스를 실행
        return "redirect:/";
    }
}
