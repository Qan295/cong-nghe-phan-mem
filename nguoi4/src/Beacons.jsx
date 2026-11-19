
import { useEffect, useState } from 'react'
import './Beacons.css'

const STORAGE_KEY = 'smart-heritage-beacons'

const initialBeacons = [
  {
    id: 1,
    name: 'Beacon - Dinh Độc Lập 01',
    uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
    major: '100',
    minor: '1',
    site: 'Dinh Độc Lập',
    artifact: 'Trống đồng Đông Sơn',
    location: 'Phòng trưng bày tầng 1',
    status: 'Đang hoạt động',
  },
  {
    id: 2,
    name: 'Beacon - Địa đạo Củ Chi 01',
    uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
    major: '200',
    minor: '1',
    site: 'Địa đạo Củ Chi',
    artifact: 'Bình gốm cổ',
    location: 'Khu trưng bày hiện vật',
    status: 'Đang hoạt động',
  },
  {
    id: 3,
    name: 'Beacon - Văn Miếu 01',
    uuid: 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825',
    major: '300',
    minor: '1',
    site: 'Văn Miếu - Quốc Tử Giám',
    artifact: '',
    location: 'Khu nhà bia',
    status: 'Bảo trì',
  },
]

const emptyForm = {
  name: '',
  uuid: '',
  major: '',
  minor: '',
  site: '',
  artifact: '',
  location: '',
  status: 'Đang hoạt động',
}

export default function Beacons() {
  const [beacons, setBeacons] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialBeacons
    } catch {
      return initialBeacons
    }
  })

  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(beacons))
  }, [beacons])

  const filteredBeacons = beacons.filter((beacon) => {
    const content = `
      ${beacon.name}
      ${beacon.uuid}
      ${beacon.major}
      ${beacon.minor}
      ${beacon.site}
      ${beacon.artifact}
      ${beacon.location}
    `.toLowerCase()

    const matchesKeyword = content.includes(keyword.trim().toLowerCase())
    const matchesStatus =
      statusFilter === 'Tất cả' || beacon.status === statusFilter

    return matchesKeyword && matchesStatus
  })

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  function openEditForm(beacon) {
    setEditingId(beacon.id)
    setForm({
      name: beacon.name,
      uuid: beacon.uuid,
      major: beacon.major,
      minor: beacon.minor,
      site: beacon.site,
      artifact: beacon.artifact,
      location: beacon.location,
      status: beacon.status,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const uuid = form.uuid.trim().toUpperCase()
    const major = Number(form.major)
    const minor = Number(form.minor)

    const uuidPattern =
      /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/

    if (!uuidPattern.test(uuid)) {
      alert('UUID không đúng định dạng. Ví dụ: FDA50693-A4E2-4FB1-AFCF-C6EB07647825')
      return
    }

    if (
      !Number.isInteger(major) ||
      !Number.isInteger(minor) ||
      major < 0 ||
      major > 65535 ||
      minor < 0 ||
      minor > 65535
    ) {
      alert('Major và Minor phải là số nguyên từ 0 đến 65535.')
      return
    }

    if (
      !form.name.trim() ||
      !form.site.trim() ||
      !form.location.trim()
    ) {
      alert('Vui lòng nhập tên thiết bị, di tích và vị trí đặt.')
      return
    }

    const duplicate = beacons.some(
      (item) =>
        item.id !== editingId &&
        item.uuid.toUpperCase() === uuid &&
        Number(item.major) === major &&
        Number(item.minor) === minor
    )

    if (duplicate) {
      alert('Thiết bị có cùng UUID, Major và Minor đã tồn tại.')
      return
    }

    const newBeacon = {
      ...form,
      name: form.name.trim(),
      uuid,
      major: String(major),
      minor: String(minor),
      site: form.site.trim(),
      artifact: form.artifact.trim(),
      location: form.location.trim(),
    }

    if (editingId !== null) {
      setBeacons((previous) =>
        previous.map((item) =>
          item.id === editingId ? { ...item, ...newBeacon } : item
        )
      )
      alert('Cập nhật thiết bị thành công!')
    } else {
      setBeacons((previous) => [
        ...previous,
        { id: Date.now(), ...newBeacon },
      ])
      alert('Thêm thiết bị thành công!')
    }

    closeForm()
  }

  function deleteBeacon(beacon) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa thiết bị "${beacon.name}" không?`
    )

    if (confirmed) {
      setBeacons((previous) =>
        previous.filter((item) => item.id !== beacon.id)
      )
    }
  }

  const activeCount = beacons.filter(
    (item) => item.status === 'Đang hoạt động'
  ).length

  const maintenanceCount = beacons.filter(
    (item) => item.status === 'Bảo trì'
  ).length

  const inactiveCount = beacons.filter(
    (item) => item.status === 'Ngừng hoạt động'
  ).length

  return (
    <section className="beacons-page">
      <div className="beacons-heading">
        <div>
          <p className="eyebrow">SMART HERITAGE / QUẢN LÝ THIẾT BỊ</p>
          <h1>Gán vị trí iBeacon</h1>
          <p className="muted">
            Quản lý thiết bị và vị trí gắn beacon tại các di tích.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Thêm iBeacon
        </button>
      </div>

      <div className="beacon-stats">
        <article className="panel beacon-stat">
          <span>Tổng thiết bị</span>
          <strong>{beacons.length}</strong>
        </article>

        <article className="panel beacon-stat">
          <span>Đang hoạt động</span>
          <strong>{activeCount}</strong>
        </article>

        <article className="panel beacon-stat">
          <span>Đang bảo trì</span>
          <strong>{maintenanceCount}</strong>
        </article>

        <article className="panel beacon-stat">
          <span>Ngừng hoạt động</span>
          <strong>{inactiveCount}</strong>
        </article>
      </div>

      <div className="beacons-toolbar">
        <input
          className="search-input"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, UUID, di tích hoặc vị trí..."
          aria-label="Tìm kiếm iBeacon"
        />

        <select
          className="beacon-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Lọc trạng thái thiết bị"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          <option value="Đang hoạt động">Đang hoạt động</option>
          <option value="Bảo trì">Bảo trì</option>
          <option value="Ngừng hoạt động">Ngừng hoạt động</option>
        </select>

        <span className="beacons-count">
          {filteredBeacons.length} / {beacons.length} thiết bị
        </span>
      </div>

      {showForm && (
        <form className="beacon-form panel" onSubmit={handleSubmit}>
          <h2>
            {editingId !== null
              ? 'Chỉnh sửa thiết bị iBeacon'
              : 'Thêm thiết bị iBeacon mới'}
          </h2>

          <label>
            Tên thiết bị *
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Beacon - Dinh Độc Lập 02"
            />
          </label>

          <label>
            UUID *
            <input
              name="uuid"
              value={form.uuid}
              onChange={handleChange}
              required
              placeholder="FDA50693-A4E2-4FB1-AFCF-C6EB07647825"
            />
          </label>

          <label>
            Major *
            <input
              type="number"
              name="major"
              min="0"
              max="65535"
              step="1"
              value={form.major}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 100"
            />
          </label>

          <label>
            Minor *
            <input
              type="number"
              name="minor"
              min="0"
              max="65535"
              step="1"
              value={form.minor}
              onChange={handleChange}
              required
              placeholder="Ví dụ: 1"
            />
          </label>

          <label>
            Di tích được gán *
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              required
              placeholder="Nhập tên di tích"
            />
          </label>

          <label>
            Hiện vật liên quan
            <input
              name="artifact"
              value={form.artifact}
              onChange={handleChange}
              placeholder="Nhập tên hiện vật (nếu có)"
            />
          </label>

          <label className="beacon-location">
            Vị trí đặt thiết bị *
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Phòng trưng bày tầng 1"
            />
          </label>

          <label>
            Trạng thái
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Đang hoạt động</option>
              <option>Bảo trì</option>
              <option>Ngừng hoạt động</option>
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

            <button type="submit" className="primary-button">
              {editingId !== null ? 'Lưu thay đổi' : 'Thêm thiết bị'}
            </button>
          </div>
        </form>
      )}

      <div className="panel beacons-table-panel">
        <div className="beacons-table-scroll">
          <table className="beacons-table">
            <thead>
              <tr>
                <th>Tên thiết bị</th>
                <th>UUID / Major / Minor</th>
                <th>Di tích</th>
                <th>Hiện vật</th>
                <th>Vị trí đặt</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredBeacons.map((beacon) => (
                <tr key={beacon.id}>
                  <td className="beacon-name">{beacon.name}</td>

                  <td>
                    <div className="beacon-identifiers">
                      <span>{beacon.uuid}</span>
                      <small>
                        Major: {beacon.major} · Minor: {beacon.minor}
                      </small>
                    </div>
                  </td>

                  <td>{beacon.site}</td>
                  <td>{beacon.artifact || 'Chưa gán'}</td>
                  <td>{beacon.location}</td>

                  <td>
                    <span
                      className={`beacon-status ${
                        beacon.status === 'Đang hoạt động'
                          ? 'beacon-active'
                          : beacon.status === 'Bảo trì'
                            ? 'beacon-maintenance'
                            : 'beacon-inactive'
                      }`}
                    >
                      {beacon.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openEditForm(beacon)}
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="text-button delete-button"
                        onClick={() => deleteBeacon(beacon)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBeacons.length === 0 && (
                <tr>
                  <td colSpan="7" className="beacon-empty">
                    Không tìm thấy thiết bị phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="demo-note">
        Dữ liệu thiết bị đang lưu trên trình duyệt bằng localStorage.
        Chưa kết nối phần cứng iBeacon hoặc máy chủ.
      </p>
    </section>
  )
}
