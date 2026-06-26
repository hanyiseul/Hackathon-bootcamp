// Controller : 외부 API 요청을 받음
// 직접 업무 로직을 처리하지 않고 Serivce를 호출
package com.example.mobilebank.controller;

import com.example.mobilebank.dto.AdminDtos.*;
import com.example.mobilebank.service.AdminService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    public AdminController(AdminService adminService) { this.adminService = adminService; }

    @GetMapping("/dashboard")
    public Object dashboard() { return adminService.dashboard(); }
    @PostMapping("/users")
    public Object createUser(@RequestBody CreateUserRequest r) { return adminService.createUser(r); }
    @PatchMapping("/users/{userId}/password")
    public Object changePassword(@PathVariable Long userId, @RequestBody PasswordChangeRequest r) { return adminService.changePassword(userId, r); }
    @PatchMapping("/users/{userId}/status")
    public Object changeStatus(@PathVariable Long userId, @RequestBody StatusChangeRequest r) { return adminService.changeStatus(userId, r); }
    @PostMapping("/accounts")
    public Object createAccount(@RequestBody CreateAccountRequest r) { return adminService.createAccount(r); }
    @DeleteMapping("/accounts/{accountId}")
    public Object closeAccount(@PathVariable Long accountId) { return adminService.closeAccount(accountId); }
}
