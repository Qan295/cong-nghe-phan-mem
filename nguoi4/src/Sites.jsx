
import { useEffect, useState } from 'react'
import './Sites.css'

const initialSites = [
  {
    id: 1,
    name: 'Dinh Độc Lập',
    location: 'Quận 1, TP. Hồ Chí Minh',
    type: 'Di tích lịch sử',
    status: 'Đang hoạt động',
  },
  {
    id: 2,
    name: 'Địa đạo Củ Chi',
    location: 'Củ Chi, TP. Hồ Chí Minh',
    type: 'Di tích lịch sử',
    status: 'Đang hoạt động',
  },
  {
    id: 3,
    name: 'Văn Miếu - Quốc Tử Giám',
    location: 'Đống Đa, Hà Nội',
    type: 'Di tích văn hóa',
    status: 'Đang hoạt động',
  },
]

const emptyForm = {
  name: '',
  location: '',
  type: 'Di tích lịch sử',
  status: 'Đang hoạt động',
}

const STORAGE_KEY = 'smart-heritage-sites'

export default function Sites() {
  const [sites, setSites] = useState(() => {
    try {
      const savedSites = localStorage.getItem(STORAGE_KEY)

      if (savedSites) {
        const parsedSites = JSON.parse(savedSites)
        if (Array.isArray(parsedSites)) return parsedSites
      }
    } catch (error) {
      console.error('Không thể đọc dữ liệu di tích:', error)
    }

    return initialSites
  })

  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Lưu dữ liệu vào trình duyệt mỗi khi danh sách thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sites))
    } catch (error) {
      console.error('Không thể lưu dữ liệu di tích:', error)
      alert('Không thể lưu dữ liệu trên trình duyệt.')
    }
  }, [sites])

  // Tìm kiếm và lọc di tích
  const filteredSites = sites.filter((site) => {
    const searchText = `${site.name} ${site.location} ${site.type}`
      .toLowerCase()

    const matchesKeyword = searchText.includes(keyword.trim().toLowerCase())

    const matchesStatus =
      statusFilter === 'Tất cả' || site.status === statusFilter

    return matchesKeyword && matchesStatus
  })

  // Mở form thêm mới
  function openAddForm() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
  }

  // Mở form chỉnh sửa
  function openEditForm(site) {
    setEditingId(site.id)

    setForm({
      name: site.name,
      location: site.location,
      type: site.type,
      status: site.status,
    })

    setShowForm(true)
  }

  // Đóng form
  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
  }

  // Xử lý thay đổi dữ liệu nhập
  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  // Thêm hoặc cập nhật di tích
  function handleSubmit(event) {
    event.preventDefault()

    if (!form.name.trim() || !form.location.trim()) {
      alert('Vui lòng nhập đầy đủ tên di tích và địa điểm.')
      return
    }

    const cleanedForm = {
      name: form.name.trim(),
      location: form.location.trim(),
      type: form.type,
      status: form.status,
    }

    if (editingId !== null) {
      setSites((previous) =>
        previous.map((site) =>
          site.id === editingId
            ? { ...site, ...cleanedForm }
            : site
        )
      )

      alert('Cập nhật di tích thành công!')
    } else {
      const newSite = {
        id: Date.now(),
        ...cleanedForm,
      }

      setSites((previous) => [...previous, newSite])

      alert('Thêm di tích thành công!')
    }

    closeForm()
  }

  // Xóa di tích
  function deleteSite(site) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa di tích "${site.name}" không?`
    )

    if (!confirmed) return

    setSites((previous) =>
      previous.filter((item) => item.id !== site.id)
    )

    alert('Đã xóa di tích!')
  }

  return (
    <section className="sites-page">

      {/* Tiêu đề trang */}
      <div className="sites-heading">
        <div>
          <p className="eyebrow">SMART HERITAGE / QUẢN LÝ</p>
          <h1>Quản lý di tích</h1>
          <p className="muted">
            Quản lý thông tin các di tích lịch sử và văn hóa.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Thêm di tích
        </button>
      </div>

      {/* Thanh tìm kiếm và lọc */}
      <div className="sites-toolbar">
        <input
          className="search-input"
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, địa điểm hoặc loại di tích..."
          aria-label="Tìm kiếm di tích"
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Lọc theo trạng thái"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Tạm đóng cửa">Tạm đóng cửa</option>
        </select>

        <span className="sites-count">
          {filteredSites.length} / {sites.length} di tích
        </span>
      </div>

      {/* Form thêm và chỉnh sửa */}
      {showForm && (
        <form className="site-form panel" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null
              ? 'Chỉnh sửa thông tin di tích'
              : 'Thêm di tích mới'}
          </h2>

          <label>
            Tên di tích *
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên di tích"
            />
          </label>

          <label>
            Địa điểm *
            <input
              type="text"
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="Nhập địa chỉ di tích"
            />
          </label>

          <label>
            Loại di tích
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Di tích lịch sử</option>
              <option>Di tích văn hóa</option>
              <option>Di tích kiến trúc</option>
              <option>Di tích khảo cổ</option>
            </select>
          </label>

          <label>
            Trạng thái
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Đang hoạt động</option>
              <option>Tạm đóng cửa</option>
            </select>
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={closeForm}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              {editingId !== null ? 'Lưu thay đổi' : 'Thêm di tích'}
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách di tích */}
      <div className="panel sites-table-panel">
        <div className="table-scroll">
          <table className="sites-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên di tích</th>
                <th>Địa điểm</th>
                <th>Loại di tích</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredSites.map((site, index) => (
                <tr key={site.id}>
                  <td>{index + 1}</td>

                  <td className="site-name">
                    {site.name}
                  </td>

                  <td>{site.location}</td>

                  <td>{site.type}</td>

                  <td>
                    <span
                      className={`site-status ${
                        site.status === 'Đang hoạt động'
                          ? 'status-active'
                          : 'status-paused'
                      }`}
                    >
                      {site.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openEditForm(site)}
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="text-button delete-button"
                        onClick={() => deleteSite(site)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSites.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Không tìm thấy di tích phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="demo-note">
        Dữ liệu hiện được lưu trên trình duyệt bằng localStorage.
        Chưa kết nối cơ sở dữ liệu MySQL hoặc API.
      </p>
    </section>
  )
}
