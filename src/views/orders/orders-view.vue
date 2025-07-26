<template>
  <!-- 订单管理页面 -->
  <div class="page">
    <div class="content-card">
      <div class="card-header">
        <div class="card-title">订单管理</div>
        <div class="card-actions">
          <button class="btn btn-secondary">📊 导出数据</button>
        </div>
      </div>
      <div class="card-body">
        <div class="filters">
          <div class="filter-item">
            <label class="filter-label">订单状态:</label>
            <select class="form-select filter-select">
              <option>全部状态</option>
              <option>待制作</option>
              <option>已完成</option>
            </select>
          </div>
          <div class="filter-item">
            <label class="filter-label">日期范围:</label>
            <input type="date" class="form-input" style="max-width: 150px" />
            <span>至</span>
            <input type="date" class="form-input" style="max-width: 150px" />
          </div>
          <div class="filter-item">
            <button class="btn btn-primary">筛选</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>订单号</th>
              <th>客户信息</th>
              <th>商品明细</th>
              <th>订单金额</th>
              <th>支付方式</th>
              <th>订单状态</th>
              <th>下单时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>HU20241201001</td>
              <td>
                <div>张先生</div>
                <div style="font-size: 12px; color: var(--text-secondary)">138****8888</div>
              </td>
              <td>
                <div>美式咖啡 x2</div>
                <div>香草拿铁 x1</div>
              </td>
              <td>¥45.60</td>
              <td>微信支付</td>
              <td>
                <span class="status-badge status-success">已完成</span>
              </td>
              <td>2024-12-01 14:30</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail(this)">
                  查看
                </button>
              </td>
            </tr>
            <tr>
              <td>HU20241201002</td>
              <td>
                <div>李女士</div>
                <div style="font-size: 12px; color: var(--text-secondary)">139****9999</div>
              </td>
              <td>
                <div>卡布奇诺 x1</div>
                <div>提拉米苏拿铁 x1</div>
              </td>
              <td>¥38.25</td>
              <td>余额支付</td>
              <td>
                <span class="status-badge status-warning">待制作</span>
              </td>
              <td>2024-12-01 14:25</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail(this)">
                  查看
                </button>
                <button class="btn btn-success btn-sm" onclick="completeOrder(this)">完成</button>
              </td>
            </tr>
            <tr>
              <td>HU20241201003</td>
              <td>
                <div>王先生</div>
                <div style="font-size: 12px; color: var(--text-secondary)">137****7777</div>
              </td>
              <td>
                <div>冰美式 x2</div>
                <div>焦糖玛奇朵 x1</div>
              </td>
              <td>¥57.80</td>
              <td>微信支付</td>
              <td>
                <span class="status-badge status-warning">待制作</span>
              </td>
              <td>2024-12-01 14:20</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail(this)">
                  查看
                </button>
                <button class="btn btn-success btn-sm" onclick="completeOrder(this)">完成</button>
              </td>
            </tr>
            <tr>
              <td>HU20241201004</td>
              <td>
                <div>陈女士</div>
                <div style="font-size: 12px; color: var(--text-secondary)">136****6666</div>
              </td>
              <td>
                <div>拿铁 x1</div>
                <div>摩卡 x1</div>
              </td>
              <td>¥42.50</td>
              <td>微信支付</td>
              <td>
                <span class="status-badge status-success">已完成</span>
              </td>
              <td>2024-12-01 14:15</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail(this)">
                  查看
                </button>
              </td>
            </tr>
            <tr>
              <td>HU20241201005</td>
              <td>
                <div>刘先生</div>
                <div style="font-size: 12px; color: var(--text-secondary)">135****5555</div>
              </td>
              <td>
                <div>美式咖啡 x1</div>
                <div>卡布奇诺 x1</div>
              </td>
              <td>¥35.80</td>
              <td>微信支付</td>
              <td>
                <span class="status-badge status-warning">待制作</span>
              </td>
              <td>2024-12-01 14:10</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewOrderDetail(this)">
                  查看
                </button>
                <button class="btn btn-success btn-sm" onclick="completeOrder(this)">完成</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 订单列表页面逻辑
</script>
