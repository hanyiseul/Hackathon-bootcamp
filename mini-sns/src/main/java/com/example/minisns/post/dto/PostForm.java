/**
 * 파이프라인
 * 1. 입력받을 값 캡슐화
 * 2. 기본 생성자 생성
 * 3. 캡슐화값 외부에서 조회 가능하게 getter 처리
 * 4. 캡슐화값 변경 가능하게 setter 처리
 * */
package com.example.minisns.post.dto;

import org.springframework.web.multipart.MultipartFile;

public class PostForm {
    // 캡슐화
    private String content; // 게시글 내용
    private MultipartFile image; // 업로드 이미지 파일 (MultipartFile: 업로드된 파일을 담는 객체)

    // 기본 생성자
    public PostForm() {
    }

    // getter
    public String getContent() {
        return content;
    }
    public MultipartFile getImage() {
        return image;
    }

    // setter
    public void setContent(String content) {
        this.content = content;
    }
    public void setImage(MultipartFile image) {
        this.image = image;
    }
}
