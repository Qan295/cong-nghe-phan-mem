import Artifacts from './Artifacts'
import { useState } from 'react'
import Sites from './Sites'
import './App.css'

const menuItems = [
  { id: 'dashboard', icon: '▦', label: 'Tổng quan' },
  { id: 'sites', icon: '⌂', label: 'Quản lý di tích' },
  { id: 'artifacts', icon: '◇', label: 'Quản lý hiện vật' },
  { id: 'media', icon: '▧', label: 'Đa phương tiện' },
  { id: 'beacons', icon: '⌁', label: 'Gán vị trí iBeacon' },
  { id: 'reports', icon: '▤', label: 'Báo cáo thống kê' },
]

const stats = [
  { label: 'Tổng số di tích', value: '12', note: '+2 trong tháng', icon: '⌂' },
  { label: 'Tổng số hiện vật', value: '248', note: 'Đang quản lý', icon: '◇' },
  { label: 'Lượt tương tác', value: '1.286', note: '+12,5% so với tháng trước', icon: '↗' },
  { label: 'iBeacon đang dùng', value: '36', note: 'Đã gán vị trí', icon: '⌁' },
]

const visitorData = [42, 65, 51, 82, 58, 95, 74]

function Dashboard() {
  const maxValue = Math.max(...visitorData)

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SMART HERITAGE / TỔNG QUAN</p>
          <h1>Dashboard</h1>
          <p className="muted">
            Theo dõi hoạt động hệ thống di sản thông minh.
          </p>
        </div>
        <span className="status">
          <span /> Hệ thống quản trị
        </span>
      </div>

      <section className="stats-grid">
        {stats.map((item) => (
          <article className="stat-card" key={item.label}>
            <div className="stat-top">
              <span>{item.label}</span>
              <span className="stat-icon">{item.icon}</span>
            </div>
            <strong className="stat-value">{item.value}</strong>
            <p className="stat-note">{item.note}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Lượt khách tham quan</h2>
              <p className="muted">
                Biểu đồ minh họa trong 7 ngày gần nhất
              </p>
            </div>
            <span className="tag">7 ngày</span>
          </div>

          <div className="bar-chart">
            {visitorData.map((value, index) => (
              <div className="bar-column" key={index}>
                <span className="bar-value">{value}</span>
                <div className="bar-track">
                  <div
                    className="bar"
                    style={{ height: `${(value / maxValue) * 100}%` }}
                  />
                </div>
                <span className="bar-label">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][index]}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Hiện vật nổi bật</h2>
              <p className="muted">Theo lượt tương tác mẫu</p>
            </div>
          </div>

          <div className="artifact-row">
            <div className="artifact-number">01</div>
            <div className="artifact-info">
              <strong>Trống đồng Đông Sơn</strong>
              <span>Di tích mẫu A</span>
            </div>
            <strong>328</strong>
          </div>

          <div className="artifact-row">
            <div className="artifact-number">02</div>
            <div className="artifact-info">
              <strong>Bình gốm cổ</strong>
              <span>Di tích mẫu B</span>
            </div>
            <strong>246</strong>
          </div>

          <div className="artifact-row">
            <div className="artifact-number">03</div>
            <div className="artifact-info">
              <strong>Bản khắc lịch sử</strong>
              <span>Di tích mẫu A</span>
            </div>
            <strong>194</strong>
          </div>

          <p className="demo-note">
            * Số liệu minh họa, chưa lấy từ cơ sở dữ liệu.
          </p>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-heading">
          <div>
            <h2>Hoạt động quản trị</h2>
            <p className="muted">Các chức năng dự kiến của Web Admin</p>
          </div>
        </div>

        <div className="quick-actions">
          <div>
            <span>01</span>
            <strong>Quản lý di tích</strong>
            <p>Thông tin và trạng thái di tích</p>
          </div>
          <div>
            <span>02</span>
            <strong>Quản lý hiện vật</strong>
            <p>Nội dung và dữ liệu hiện vật</p>
          </div>
          <div>
            <span>03</span>
            <strong>Gán iBeacon</strong>
            <p>Liên kết beacon với vị trí</p>
          </div>
          <div>
            <span>04</span>
            <strong>Xuất báo cáo</strong>
            <p>Chuẩn bị báo cáo PDF/Excel</p>
          </div>
        </div>
      </section>
    </>
  )
}

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const currentMenu = menuItems.find(
    (item) => item.id === activePage
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">SH</div>
          <div>
            <strong>Smart Heritage</strong>
            <span>ADMIN PORTAL</span>
          </div>
        </div>

        <p className="menu-caption">MENU CHÍNH</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${
                activePage === item.id ? 'active' : ''
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-avatar">AD</div>
          <div>
            <strong>Quản trị viên</strong>
            <span>Web Admin</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span>Hệ thống quản lý di sản</span>
          <div className="topbar-right">
            <span className="online-dot" /> Đang hoạt động
          </div>
        </header>

        <div className="page-content">
         {activePage === 'dashboard' ? (
  <Dashboard />
) : activePage === 'sites' ? (
  <Sites />
) : activePage === 'artifacts' ? (
  <Artifacts />
) : (
            <div className="page-placeholder panel">
              <span className="placeholder-icon">
                {currentMenu?.icon}
              </span>
              <h1>{currentMenu?.label ?? 'Chức năng'}</h1>
              <p>
                Giao diện chức năng này sẽ được xây dựng ở bước tiếp theo.
              </p>
              <button
                className="primary-button"
                onClick={() => setActivePage('dashboard')}
              >
                Quay lại Dashboard
              </button>
            </div>
          )}

          <footer>
            Smart Heritage · Web Admin · Bản phát triển thử nghiệm
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
