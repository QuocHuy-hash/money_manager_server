# Tài Liệu API - Money Manager Server

## Tổng Quan
Tài liệu này mô tả tất cả các API endpoint có sẵn trong Money Manager Server, bao gồm tham số đầu vào và response.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Hầu hết các API yêu cầu xác thực bằng Bearer Token. Thêm header:
```
Authorization: Bearer <your_token>
```

---

## 1. User Management APIs

### 1.1 Đăng ký tài khoản
**POST** `/user/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}
```

**Response:**
```json
{
  "status": "OK",
  "message": "User created successfully",
  "data": {
    "id": "60d0fe4f5311236168a109ca",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "verified": false
  }
}
```

### 1.2 Đăng nhập
**POST** `/user/login`

**Request Body:**
```json
{
  "user_name": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "OK",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "verified": true
    }
  }
}
```

### 1.3 Gửi lại email xác thực
**POST** `/user/resend-email`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 1.4 Xác thực email
**POST** `/user/verify-email`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### 1.5 Lấy thông tin người dùng
**GET** `/user/get-info`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "OK",
  "data": {
    "id": "60d0fe4f5311236168a109ca",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "verified": true
  }
}
```

---

## 2. Transaction Management APIs

### 2.1 Thêm giao dịch mới
**POST** `/transaction/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 1000000,
  "type": "expense",
  "category": "Food",
  "description": "Ăn trưa",
  "date": "2024-01-15T10:30:00.000Z"
}
```

### 2.2 Cập nhật giao dịch
**POST** `/transaction/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "transaction_id",
  "amount": 1200000,
  "type": "expense",
  "category": "Food",
  "description": "Ăn trưa và tối",
  "date": "2024-01-15T10:30:00.000Z"
}
```

### 2.3 Lấy chi tiết giao dịch
**GET** `/transaction/get-detail?id=transaction_id`

**Headers:** `Authorization: Bearer <token>`

### 2.4 Lấy danh sách giao dịch
**GET** `/transaction/get-list?page=1&limit=10&startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "OK",
  "data": {
    "transactions": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10
    }
  }
}
```

### 2.5 Lấy danh mục giao dịch
**GET** `/transaction/get-categories`

**Headers:** `Authorization: Bearer <token>`

### 2.6 Lấy tóm tắt giao dịch
**GET** `/transaction/get-list-summary?startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

### 2.7 Lấy giao dịch theo danh mục
**GET** `/transaction/get-by-category?category=Food&startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

---

## 3. Fixed Expenses APIs

### 3.1 Thêm chi phí cố định
**POST** `/fixed-expense/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 5000000,
  "name": "Tiền thuê nhà",
  "description": "Tiền thuê nhà hàng tháng",
  "dueDate": 15,
  "category": "Housing"
}
```

### 3.2 Cập nhật chi phí cố định
**POST** `/fixed-expense/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "fixed_expense_id",
  "amount": 5500000,
  "name": "Tiền thuê nhà",
  "description": "Tiền thuê nhà hàng tháng",
  "dueDate": 15,
  "category": "Housing"
}
```

### 3.3 Lấy chi tiết chi phí cố định
**GET** `/fixed-expense/get-detail?id=fixed_expense_id`

**Headers:** `Authorization: Bearer <token>`

### 3.4 Lấy danh sách chi phí cố định
**GET** `/fixed-expense/get-list?page=1&limit=10`

**Headers:** `Authorization: Bearer <token>`

### 3.5 Xóa chi phí cố định
**POST** `/fixed-expense/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "fixed_expense_id"
}
```

---

## 4. Financial Goals APIs

### 4.1 Thêm mục tiêu tài chính
**POST** `/goal/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Mua xe hơi",
  "targetAmount": 500000000,
  "currentAmount": 10000000,
  "targetDate": "2024-12-31T00:00:00.000Z",
  "priority": "high",
  "description": "Tiết kiệm để mua xe hơi"
}
```

### 4.2 Cập nhật mục tiêu
**POST** `/goal/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "goal_id",
  "name": "Mua xe hơi",
  "targetAmount": 500000000,
  "currentAmount": 15000000,
  "targetDate": "2024-12-31T00:00:00.000Z",
  "priority": "high",
  "description": "Tiết kiệm để mua xe hơi"
}
```

### 4.3 Lấy mục tiêu của người dùng
**GET** `/goal/get-by-user`

**Headers:** `Authorization: Bearer <token>`

### 4.4 Lấy mục tiêu theo ID
**GET** `/goal/get-by-id?id=goal_id`

**Headers:** `Authorization: Bearer <token>`

### 4.5 Tính tiết kiệm hàng tháng
**GET** `/goal/get-monthly-saving`

**Headers:** `Authorization: Bearer <token>`

### 4.6 Lấy tổng tiết kiệm theo tháng
**GET** `/goal/get-total-by-month`

**Headers:** `Authorization: Bearer <token>`

### 4.7 Xóa mục tiêu
**POST** `/goal/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "goal_id"
}
```

---

## 5. Report APIs

### 5.1 Báo cáo tóm tắt chi tiêu
**GET** `/report/expense-summary?startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "OK",
  "data": {
    "totalExpense": 5000000,
    "totalIncome": 10000000,
    "categories": [
      {
        "category": "Food",
        "amount": 2000000,
        "percentage": 40
      }
    ]
  }
}
```

### 5.2 Báo cáo tóm tắt
**GET** `/report/summary?startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

### 5.3 Báo cáo chi tiêu hàng ngày
**GET** `/report/expense-daily?startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

### 5.4 Báo cáo mục tiêu
**GET** `/report/goal`

**Headers:** `Authorization: Bearer <token>`

### 5.5 Báo cáo tài chính theo năm
**GET** `/report/get-report-by-year?year=2024`

**Headers:** `Authorization: Bearer <token>`

---

## 6. Upload APIs

### 6.1 Upload avatar
**POST** `/avartar/user/upload`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `multipart/form-data`
- `images`: File ảnh

### 6.2 Lấy avatar
**GET** `/avartar/user/show-avatar`

**Headers:** `Authorization: Bearer <token>`

---

## 7. Spending Limit APIs

### 7.1 Tạo giới hạn chi tiêu
**POST** `/spending-limit/create`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 10000000,
  "period": "monthly",
  "category": "Food"
}
```

### 7.2 Cập nhật giới hạn chi tiêu
**POST** `/spending-limit/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "limit_id",
  "amount": 12000000,
  "period": "monthly",
  "category": "Food"
}
```

### 7.3 Lấy giới hạn của người dùng
**GET** `/spending-limit/get-user`

**Headers:** `Authorization: Bearer <token>`

### 7.4 Lấy trạng thái giới hạn
**GET** `/spending-limit/get-user-status`

**Headers:** `Authorization: Bearer <token>`

### 7.5 Lấy giới hạn theo ID
**GET** `/spending-limit/get-by-id?id=limit_id`

**Headers:** `Authorization: Bearer <token>`

### 7.6 Xóa giới hạn chi tiêu
**POST** `/spending-limit/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "limit_id"
}
```

---

## 8. Group Management APIs

### 8.1 Tạo nhóm
**POST** `/group/create`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Gia đình",
  "description": "Nhóm quản lý tài chính gia đình"
}
```

### 8.2 Cập nhật nhóm
**POST** `/group/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "group_id",
  "name": "Gia đình",
  "description": "Nhóm quản lý tài chính gia đình"
}
```

### 8.3 Lấy nhóm của người dùng
**GET** `/group/user-groups`

**Headers:** `Authorization: Bearer <token>`

### 8.4 Lấy nhóm theo ID
**GET** `/group/get-by-id?id=group_id`

**Headers:** `Authorization: Bearer <token>`

### 8.5 Lấy tóm tắt nhóm
**GET** `/group/get-summaries`

**Headers:** `Authorization: Bearer <token>`

### 8.6 Xóa nhóm
**POST** `/group/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "group_id"
}
```

### 8.7 Mời thành viên
**POST** `/group/invite`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "email": "member@example.com",
  "permissions": ["read", "write"]
}
```

### 8.8 Phản hồi lời mời
**POST** `/group/respond-invitation`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "invitationId": "invitation_id",
  "response": "accept"
}
```

### 8.9 Lấy lời mời đang chờ
**GET** `/group/pending-invitations`

**Headers:** `Authorization: Bearer <token>`

### 8.10 Xóa thành viên
**POST** `/group/remove-member`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "memberId": "member_id"
}
```

### 8.11 Lấy danh sách thành viên
**GET** `/group/members?groupId=group_id`

**Headers:** `Authorization: Bearer <token>`

### 8.12 Cập nhật quyền thành viên
**POST** `/group/update-permissions`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "memberId": "member_id",
  "permissions": ["read", "write", "admin"]
}
```

### 8.13 Rời nhóm
**POST** `/group/leave`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id"
}
```

### 8.14 Chuyển quyền sở hữu
**POST** `/group/transfer-ownership`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "newOwnerId": "new_owner_id"
}
```

### 8.15 Thêm giao dịch nhóm
**POST** `/group/transaction/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "amount": 1000000,
  "type": "expense",
  "category": "Food",
  "description": "Ăn trưa nhóm",
  "date": "2024-01-15T10:30:00.000Z"
}
```

### 8.16 Lấy giao dịch nhóm
**GET** `/group/transactions?groupId=group_id`

**Headers:** `Authorization: Bearer <token>`

### 8.17 Cập nhật giao dịch nhóm
**POST** `/group/transaction/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "transaction_id",
  "amount": 1200000,
  "type": "expense",
  "category": "Food",
  "description": "Ăn trưa và tối nhóm",
  "date": "2024-01-15T10:30:00.000Z"
}
```

### 8.18 Xóa giao dịch nhóm
**POST** `/group/transaction/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "transaction_id"
}
```

### 8.19 Lấy chi phí cố định nhóm
**GET** `/group/fixed-expenses?groupId=group_id`

**Headers:** `Authorization: Bearer <token>`

### 8.20 Thêm chi phí cố định nhóm
**POST** `/group/fixed-expense/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "groupId": "group_id",
  "amount": 5000000,
  "name": "Tiền thuê văn phòng",
  "description": "Tiền thuê văn phòng hàng tháng",
  "dueDate": 15,
  "category": "Office"
}
```

### 8.21 Cập nhật chi phí cố định nhóm
**POST** `/group/fixed-expense/update`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "fixed_expense_id",
  "amount": 5500000,
  "name": "Tiền thuê văn phòng",
  "description": "Tiền thuê văn phòng hàng tháng",
  "dueDate": 15,
  "category": "Office"
}
```

### 8.22 Xóa chi phí cố định nhóm
**POST** `/group/fixed-expense/delete`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "id": "fixed_expense_id"
}
```

---

## 9. Casso Bank APIs

### 9.1 Liên kết tài khoản ngân hàng
**POST** `/link-bank`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "bankName": "VietcomBank",
  "accountNumber": "1234567890",
  "accountName": "Nguyễn Văn A"
}
```

### 9.2 Lấy giao dịch ngân hàng
**GET** `/get-transactions?startDate=2024-01-01&endDate=2024-01-31`

**Headers:** `Authorization: Bearer <token>`

### 9.3 Lấy thông tin tài khoản ngân hàng
**GET** `/get-info-bank`

**Headers:** `Authorization: Bearer <token>`

### 9.4 Lấy chi tiết giao dịch
**POST** `/get-transactions-details`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "transactionId": "transaction_id"
}
```

### 9.5 Lấy danh sách tài khoản đã liên kết
**GET** `/get-bank-connected`

**Headers:** `Authorization: Bearer <token>`

---

## Error Responses

Tất cả API có thể trả về các lỗi sau:

### 400 Bad Request
```json
{
  "status": "ERROR",
  "message": "Invalid request data",
  "code": 400
}
```

### 401 Unauthorized
```json
{
  "status": "ERROR",
  "message": "Unauthorized access",
  "code": 401
}
```

### 404 Not Found
```json
{
  "status": "ERROR",
  "message": "Resource not found",
  "code": 404
}
```

### 500 Internal Server Error
```json
{
  "status": "ERROR",
  "message": "Internal server error",
  "code": 500
}
```

---

## Ghi Chú

1. **Authentication**: Hầu hết các API yêu cầu Bearer Token trong header Authorization
2. **Date Format**: Sử dụng ISO 8601 format cho các trường ngày tháng
3. **Pagination**: Các API danh sách hỗ trợ phân trang với tham số `page` và `limit`
4. **File Upload**: Sử dụng `multipart/form-data` cho upload file
5. **Response Format**: Tất cả response đều có format thống nhất với `status`, `