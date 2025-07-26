<template>
  <div id="loginPage" class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>HUSH CLUB</h1>
        <p>管理后台登录</p>
      </div>
      <form id="loginForm" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input id="loginUsername" type="text" class="form-control" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input id="loginPassword" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary login-btn">登录</button>
      </form>
      <div class="login-footer">
        <p>© 2024 HUSH CLUB. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>
