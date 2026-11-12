<<<<<<< HEAD

import { useEffect, useState } from 'react'
import './Artifacts.css'

const ARTIFACT_KEY = 'smart-heritage-artifacts'
const SITE_KEY = 'smart-heritage-sites'

const initialArtifacts = [
  {
    id: 1,
    name: 'Trống đồng Đông Sơn',
    description: 'Hiện vật tiêu biểu của nền văn hóa Đông Sơn.',
    category: 'Đồ đồng',
    siteId: '1',
    status: 'Đang trưng bày',
    image: '',
  },
  {
    id: 2,
    name: 'Bình gốm cổ',
    description: 'Bình gốm cổ được lưu giữ và bảo tồn.',
    category: 'Đồ gốm',
    siteId: '2',
    status: 'Đang trưng bày',
    image: '',
  },
  {
    id: 3,
    name: 'Bản khắc lịch sử',
    description: 'Tư liệu khắc ghi các sự kiện lịch sử.',
    category: 'Tư liệu lịch sử',
    siteId: '1',
    status: 'Đang bảo quản',
    image: '',
  },
]

const emptyForm = {
  name: '',
  description: '',
  category: 'Đồ đồng',
  siteId: '',
  status: 'Đang trưng bày',
  image: '',
}

export default function Artifacts() {
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem(SITE_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [artifacts, setArtifacts] = useState(() => {
    try {
      const saved = localStorage.getItem(ARTIFACT_KEY)
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) ? parsed : initialArtifacts
    } catch {
      return initialArtifacts
    }
  })

  const [keyword, setKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Tất cả')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Lưu danh sách hiện vật
  useEffect(() => {
    localStorage.setItem(ARTIFACT_KEY, JSON.stringify(artifacts))
  }, [artifacts])

  // Cập nhật danh sách di tích nếu có thay đổi trên trình duyệt
  useEffect(() => {
    function refreshSites() {
      try {
        const saved = localStorage.getItem(SITE_KEY)
        const parsed = saved ? JSON.parse(saved) : []
        setSites(Array.isArray(parsed) ? parsed : [])
      } catch {
        setSites([])
      }
    }

    window.addEventListener('storage', refreshSites)
    window.addEventListener('focus', refreshSites)

    return () => {
      window.removeEventListener('storage', refreshSites)
      window.removeEventListener('focus', refreshSites)
    }
  }, [])

  const getSiteName = (siteId) => {
    const site = sites.find(
      (item) => String(item.id) === String(siteId)
    )

    return site ? site.name : 'Chưa xác định di tích'
  }

  // Tìm kiếm và lọc
  const filteredArtifacts = artifacts.filter((artifact) => {
    const siteName = getSiteName(artifact.siteId)

    const searchText = `
      ${artifact.name}
      ${artifact.description}
      ${artifact.category}
      ${siteName}
    `.toLowerCase()

    const matchesKeyword = searchText.includes(
      keyword.trim().toLowerCase()
    )

    const matchesCategory =
      categoryFilter === 'Tất cả' ||
      artifact.category === categoryFilter

    return matchesKeyword && matchesCategory
  })

  function openAddForm() {
    setEditingId(null)

    setForm({
      ...emptyForm,
      siteId: sites.length > 0 ? String(sites[0].id) : '',
    })

    setShowForm(true)
  }

  function openEditForm(artifact) {
    setEditingId(artifact.id)

    setForm({
      name: artifact.name,
      description: artifact.description,
      category: artifact.category,
      siteId: String(artifact.siteId),
      status: artifact.status,
      image: artifact.image || '',
    })

    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
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

    if (!form.name.trim()) {
      alert('Vui lòng nhập tên hiện vật.')
      return
    }

    if (!form.siteId) {
      alert('Vui lòng chọn di tích chứa hiện vật.')
      return
    }

    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
    }

    if (editingId !== null) {
      setArtifacts((previous) =>
        previous.map((artifact) =>
          artifact.id === editingId
            ? { ...artifact, ...cleanedForm }
            : artifact
        )
      )

      alert('Cập nhật hiện vật thành công!')
    } else {
      setArtifacts((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...cleanedForm,
        },
      ])

      alert('Thêm hiện vật thành công!')
    }

    closeForm()
  }

  function deleteArtifact(artifact) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hiện vật "${artifact.name}" không?`
    )

    if (!confirmed) return

    setArtifacts((previous) =>
      previous.filter((item) => item.id !== artifact.id)
    )

    alert('Đã xóa hiện vật!')
  }

  return (
    <section className="artifacts-page">

      <div className="artifacts-heading">
        <div>
          <p className="eyebrow">SMART HERITAGE / QUẢN LÝ</p>
          <h1>Quản lý hiện vật</h1>
          <p className="muted">
            Quản lý thông tin và hiện vật tại các di tích.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Thêm hiện vật
        </button>
      </div>

      <div className="artifact-stats">
        <div className="panel artifact-stat">
          <span>Tổng số hiện vật</span>
          <strong>{artifacts.length}</strong>
        </div>

        <div className="panel artifact-stat">
          <span>Đang trưng bày</span>
          <strong>
            {artifacts.filter(
              (item) => item.status === 'Đang trưng bày'
            ).length}
          </strong>
        </div>

        <div className="panel artifact-stat">
          <span>Đang bảo quản</span>
          <strong>
            {artifacts.filter(
              (item) => item.status === 'Đang bảo quản'
            ).length}
          </strong>
        </div>
      </div>

      <div className="artifacts-toolbar">
        <input
          className="search-input"
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, mô tả hoặc di tích..."
          aria-label="Tìm kiếm hiện vật"
        />

        <select
          className="artifact-filter"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Lọc theo loại hiện vật"
        >
          <option value="Tất cả">Tất cả loại hiện vật</option>
          <option value="Đồ đồng">Đồ đồng</option>
          <option value="Đồ gốm">Đồ gốm</option>
          <option value="Tư liệu lịch sử">Tư liệu lịch sử</option>
          <option value="Đồ đá">Đồ đá</option>
          <option value="Khác">Khác</option>
        </select>

        <span className="artifact-count">
          {filteredArtifacts.length} / {artifacts.length} hiện vật
        </span>
      </div>

      {showForm && (
        <form
          className="artifact-form panel"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingId !== null
              ? 'Chỉnh sửa hiện vật'
              : 'Thêm hiện vật mới'}
          </h2>

          <label>
            Tên hiện vật *
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên hiện vật"
            />
          </label>

          <label>
            Di tích chứa hiện vật *
            <select
              name="siteId"
              required
              value={form.siteId}
              onChange={handleChange}
            >
              <option value="">-- Chọn di tích --</option>

              {sites.map((site) => (
                <option key={site.id} value={String(site.id)}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Loại hiện vật
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Đồ đồng</option>
              <option>Đồ gốm</option>
              <option>Tư liệu lịch sử</option>
              <option>Đồ đá</option>
              <option>Khác</option>
            </select>
          </label>

          <label>
            Trạng thái
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Đang trưng bày</option>
              <option>Đang bảo quản</option>
              <option>Tạm ngưng trưng bày</option>
            </select>
          </label>

          <label className="artifact-description">
            Mô tả hiện vật
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập thông tin giới thiệu hiện vật..."
            />
          </label>

          <label className="artifact-description">
            Đường dẫn hình ảnh (không bắt buộc)
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
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
              {editingId !== null
                ? 'Lưu thay đổi'
                : 'Thêm hiện vật'}
            </button>
          </div>
        </form>
      )}

      <div className="panel artifacts-table-panel">
        <div className="table-scroll">
          <table className="artifacts-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên hiện vật</th>
                <th>Loại hiện vật</th>
                <th>Di tích</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredArtifacts.map((artifact, index) => (
                <tr key={artifact.id}>
                  <td>{index + 1}</td>

                  <td className="artifact-name">
                    <strong>{artifact.name}</strong>
                    {artifact.description && (
                      <small>{artifact.description}</small>
                    )}
                  </td>

                  <td>{artifact.category}</td>

                  <td>{getSiteName(artifact.siteId)}</td>

                  <td>
                    <span
                      className={`artifact-status ${
                        artifact.status === 'Đang trưng bày'
                          ? 'artifact-active'
                          : 'artifact-paused'
                      }`}
                    >
                      {artifact.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openEditForm(artifact)}
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="text-button delete-button"
                        onClick={() => deleteArtifact(artifact)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredArtifacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Không tìm thấy hiện vật phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="demo-note">
        Dữ liệu hiện được lưu trên trình duyệt bằng localStorage,
        chưa kết nối MySQL hoặc API.
      </p>
    </section>
  )
}
=======

import { useEffect, useState } from 'react'
import './Artifacts.css'

const ARTIFACT_KEY = 'smart-heritage-artifacts'
const SITE_KEY = 'smart-heritage-sites'

const initialArtifacts = [
  {
    id: 1,
    name: 'Trống đồng Đông Sơn',
    description: 'Hiện vật tiêu biểu của nền văn hóa Đông Sơn.',
    category: 'Đồ đồng',
    siteId: '1',
    status: 'Đang trưng bày',
    image: '',
  },
  {
    id: 2,
    name: 'Bình gốm cổ',
    description: 'Bình gốm cổ được lưu giữ và bảo tồn.',
    category: 'Đồ gốm',
    siteId: '2',
    status: 'Đang trưng bày',
    image: '',
  },
  {
    id: 3,
    name: 'Bản khắc lịch sử',
    description: 'Tư liệu khắc ghi các sự kiện lịch sử.',
    category: 'Tư liệu lịch sử',
    siteId: '1',
    status: 'Đang bảo quản',
    image: '',
  },
]

const emptyForm = {
  name: '',
  description: '',
  category: 'Đồ đồng',
  siteId: '',
  status: 'Đang trưng bày',
  image: '',
}

export default function Artifacts() {
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem(SITE_KEY)
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [artifacts, setArtifacts] = useState(() => {
    try {
      const saved = localStorage.getItem(ARTIFACT_KEY)
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) ? parsed : initialArtifacts
    } catch {
      return initialArtifacts
    }
  })

  const [keyword, setKeyword] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Tất cả')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  // Lưu danh sách hiện vật
  useEffect(() => {
    localStorage.setItem(ARTIFACT_KEY, JSON.stringify(artifacts))
  }, [artifacts])

  // Cập nhật danh sách di tích nếu có thay đổi trên trình duyệt
  useEffect(() => {
    function refreshSites() {
      try {
        const saved = localStorage.getItem(SITE_KEY)
        const parsed = saved ? JSON.parse(saved) : []
        setSites(Array.isArray(parsed) ? parsed : [])
      } catch {
        setSites([])
      }
    }

    window.addEventListener('storage', refreshSites)
    window.addEventListener('focus', refreshSites)

    return () => {
      window.removeEventListener('storage', refreshSites)
      window.removeEventListener('focus', refreshSites)
    }
  }, [])

  const getSiteName = (siteId) => {
    const site = sites.find(
      (item) => String(item.id) === String(siteId)
    )

    return site ? site.name : 'Chưa xác định di tích'
  }

  // Tìm kiếm và lọc
  const filteredArtifacts = artifacts.filter((artifact) => {
    const siteName = getSiteName(artifact.siteId)

    const searchText = `
      ${artifact.name}
      ${artifact.description}
      ${artifact.category}
      ${siteName}
    `.toLowerCase()

    const matchesKeyword = searchText.includes(
      keyword.trim().toLowerCase()
    )

    const matchesCategory =
      categoryFilter === 'Tất cả' ||
      artifact.category === categoryFilter

    return matchesKeyword && matchesCategory
  })

  function openAddForm() {
    setEditingId(null)

    setForm({
      ...emptyForm,
      siteId: sites.length > 0 ? String(sites[0].id) : '',
    })

    setShowForm(true)
  }

  function openEditForm(artifact) {
    setEditingId(artifact.id)

    setForm({
      name: artifact.name,
      description: artifact.description,
      category: artifact.category,
      siteId: String(artifact.siteId),
      status: artifact.status,
      image: artifact.image || '',
    })

    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
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

    if (!form.name.trim()) {
      alert('Vui lòng nhập tên hiện vật.')
      return
    }

    if (!form.siteId) {
      alert('Vui lòng chọn di tích chứa hiện vật.')
      return
    }

    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
    }

    if (editingId !== null) {
      setArtifacts((previous) =>
        previous.map((artifact) =>
          artifact.id === editingId
            ? { ...artifact, ...cleanedForm }
            : artifact
        )
      )

      alert('Cập nhật hiện vật thành công!')
    } else {
      setArtifacts((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...cleanedForm,
        },
      ])

      alert('Thêm hiện vật thành công!')
    }

    closeForm()
  }

  function deleteArtifact(artifact) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa hiện vật "${artifact.name}" không?`
    )

    if (!confirmed) return

    setArtifacts((previous) =>
      previous.filter((item) => item.id !== artifact.id)
    )

    alert('Đã xóa hiện vật!')
  }

  return (
    <section className="artifacts-page">

      <div className="artifacts-heading">
        <div>
          <p className="eyebrow">SMART HERITAGE / QUẢN LÝ</p>
          <h1>Quản lý hiện vật</h1>
          <p className="muted">
            Quản lý thông tin và hiện vật tại các di tích.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={openAddForm}
        >
          + Thêm hiện vật
        </button>
      </div>

      <div className="artifact-stats">
        <div className="panel artifact-stat">
          <span>Tổng số hiện vật</span>
          <strong>{artifacts.length}</strong>
        </div>

        <div className="panel artifact-stat">
          <span>Đang trưng bày</span>
          <strong>
            {artifacts.filter(
              (item) => item.status === 'Đang trưng bày'
            ).length}
          </strong>
        </div>

        <div className="panel artifact-stat">
          <span>Đang bảo quản</span>
          <strong>
            {artifacts.filter(
              (item) => item.status === 'Đang bảo quản'
            ).length}
          </strong>
        </div>
      </div>

      <div className="artifacts-toolbar">
        <input
          className="search-input"
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, mô tả hoặc di tích..."
          aria-label="Tìm kiếm hiện vật"
        />

        <select
          className="artifact-filter"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Lọc theo loại hiện vật"
        >
          <option value="Tất cả">Tất cả loại hiện vật</option>
          <option value="Đồ đồng">Đồ đồng</option>
          <option value="Đồ gốm">Đồ gốm</option>
          <option value="Tư liệu lịch sử">Tư liệu lịch sử</option>
          <option value="Đồ đá">Đồ đá</option>
          <option value="Khác">Khác</option>
        </select>

        <span className="artifact-count">
          {filteredArtifacts.length} / {artifacts.length} hiện vật
        </span>
      </div>

      {showForm && (
        <form
          className="artifact-form panel"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingId !== null
              ? 'Chỉnh sửa hiện vật'
              : 'Thêm hiện vật mới'}
          </h2>

          <label>
            Tên hiện vật *
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên hiện vật"
            />
          </label>

          <label>
            Di tích chứa hiện vật *
            <select
              name="siteId"
              required
              value={form.siteId}
              onChange={handleChange}
            >
              <option value="">-- Chọn di tích --</option>

              {sites.map((site) => (
                <option key={site.id} value={String(site.id)}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Loại hiện vật
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option>Đồ đồng</option>
              <option>Đồ gốm</option>
              <option>Tư liệu lịch sử</option>
              <option>Đồ đá</option>
              <option>Khác</option>
            </select>
          </label>

          <label>
            Trạng thái
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option>Đang trưng bày</option>
              <option>Đang bảo quản</option>
              <option>Tạm ngưng trưng bày</option>
            </select>
          </label>

          <label className="artifact-description">
            Mô tả hiện vật
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập thông tin giới thiệu hiện vật..."
            />
          </label>

          <label className="artifact-description">
            Đường dẫn hình ảnh (không bắt buộc)
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
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
              {editingId !== null
                ? 'Lưu thay đổi'
                : 'Thêm hiện vật'}
            </button>
          </div>
        </form>
      )}

      <div className="panel artifacts-table-panel">
        <div className="table-scroll">
          <table className="artifacts-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên hiện vật</th>
                <th>Loại hiện vật</th>
                <th>Di tích</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredArtifacts.map((artifact, index) => (
                <tr key={artifact.id}>
                  <td>{index + 1}</td>

                  <td className="artifact-name">
                    <strong>{artifact.name}</strong>
                    {artifact.description && (
                      <small>{artifact.description}</small>
                    )}
                  </td>

                  <td>{artifact.category}</td>

                  <td>{getSiteName(artifact.siteId)}</td>

                  <td>
                    <span
                      className={`artifact-status ${
                        artifact.status === 'Đang trưng bày'
                          ? 'artifact-active'
                          : 'artifact-paused'
                      }`}
                    >
                      {artifact.status}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => openEditForm(artifact)}
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="text-button delete-button"
                        onClick={() => deleteArtifact(artifact)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredArtifacts.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-row">
                    Không tìm thấy hiện vật phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="demo-note">
        Dữ liệu hiện được lưu trên trình duyệt bằng localStorage,
        chưa kết nối MySQL hoặc API.
      </p>
    </section>
  )
}
>>>>>>> a95e27d (cap nhat)
