/**
 * 파이프라인
 * 1. Repository 주입받아 사용
 * 2. 생성자를 통해 의존성 초기화
 *
 * 게시글 등록
 * 1. 내용 입력 확인
 * 2. 이미지 저장
 * 3. 파일명 생성
 * 4. Repository의 save 클래스를 통해 db 저장
 *
 * 게시글 조회
 * 1. 전체 게시글 조회
 * 2. 내 게시글 조회
 *
 * 게시글 삭제
 * 1. 선택한 게시글 고유 번호(id)값으로 인식하여 삭제
 *
 * 게시글 수정
 * 1. 해당 게시글 정보 조회
 * 2. 게시글 수정하여 Repository의 edit 클래스를 통해 db 저장
 * */

package com.example.minisns.post.service;

import com.example.minisns.post.dto.PostForm;
import com.example.minisns.post.entity.Post;
import com.example.minisns.post.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service // 이 파일이 service 임을 명시
public class PostService {
    // PostRepository 호출하여 캡슐화(변경 불가능)
    private final PostRepository postRepository;

    // 생성자 생성 및 초기화
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 게시글 등록
    public void create(PostForm form, String userId) throws IOException { // 예외 처리를 강제 (MultipartFile) (

        // 내용 입력 확인
        // IllegalArgumentException : 잘못된 값 예외 처리
        if (form.getContent() == null || form.getContent().trim().isEmpty()) { // 게시글 입력 확인
            throw new IllegalArgumentException("게시글을 입력하세요");
        }
        if (form.getImage() == null || form.getImage().isEmpty()) { // 이미지 등록 확인
            throw new IllegalArgumentException("이미지를 올려주세요");
        }

        // 이미지 저장
        // 파일명 생성(중복 방지)
        String fileName = System.currentTimeMillis() + "_" + form.getImage().getOriginalFilename();
        // 파일 저장 위치
        Path uploadDir = Paths.get("src/main/resources/static/uploads"); // uploads 폴더 경로 객체 생성
        if (!Files.exists(uploadDir)) { // 폴더가 없다면
            Files.createDirectories(uploadDir); // 파일 생성
        }
        Path uploadPath = uploadDir.resolve(fileName); // uploads 경로 + 파일명 합치기
        // 실제 파일 저장
        Files.copy(form.getImage().getInputStream(), uploadPath); // uploadPath에 사용자가 등록한 이미지 넣기

        postRepository.save(form.getContent(), "/uploads/" + fileName, userId); // 게시글 내용과 이미지 저장
    }

    // 전체 게시글 조회
    public List<Post> findAll() {
        return postRepository.findAll();
    }

    // 내 게시글 조회
    public List<Post> findByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    // 게시글 삭제
    public void delete(Long postId, String userId) {
        postRepository.delete(postId, userId);
    }

    // 게시글 수정
    // 수정할 게시글 정보 조회
    public Post findById(Long id, String userId) {
        return postRepository.findById(id, userId);
    }

    // 게시글 수정
    public void edit(PostForm form, Long id, String userId) {
        postRepository.edit(form.getContent(), id, userId);
    }

}
