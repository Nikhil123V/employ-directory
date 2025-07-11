

class EmployeeDirectory {
  constructor() {
    // Mock employee data
    this.employees = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        department: "Engineering",
        role: "Senior Developer",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@company.com",
        department: "Marketing",
        role: "Marketing Manager",
      },
      {
        id: 3,
        firstName: "Mike",
        lastName: "Johnson",
        email: "mike.johnson@company.com",
        department: "Sales",
        role: "Sales Representative",
      },
      {
        id: 4,
        firstName: "Sarah",
        lastName: "Wilson",
        email: "sarah.wilson@company.com",
        department: "HR",
        role: "HR Specialist",
      },
      {
        id: 5,
        firstName: "David",
        lastName: "Brown",
        email: "david.brown@company.com",
        department: "Engineering",
        role: "Frontend Developer",
      },
      {
        id: 6,
        firstName: "Lisa",
        lastName: "Davis",
        email: "lisa.davis@company.com",
        department: "Finance",
        role: "Financial Analyst",
      },
      {
        id: 7,
        firstName: "Tom",
        lastName: "Miller",
        email: "tom.miller@company.com",
        department: "Engineering",
        role: "Backend Developer",
      },
      {
        id: 8,
        firstName: "Amy",
        lastName: "Garcia",
        email: "amy.garcia@company.com",
        department: "Marketing",
        role: "Content Creator",
      },
      {
        id: 9,
        firstName: "Chris",
        lastName: "Martinez",
        email: "chris.martinez@company.com",
        department: "Sales",
        role: "Sales Manager",
      },
      {
        id: 10,
        firstName: "Emma",
        lastName: "Anderson",
        email: "emma.anderson@company.com",
        department: "HR",
        role: "Recruiter",
      },
      {
        id: 11,
        firstName: "Ryan",
        lastName: "Taylor",
        email: "ryan.taylor@company.com",
        department: "Engineering",
        role: "DevOps Engineer",
      },
      {
        id: 12,
        firstName: "Nicole",
        lastName: "Thomas",
        email: "nicole.thomas@company.com",
        department: "Finance",
        role: "Accountant",
      },
      {
        id: 13,
        firstName: "Kevin",
        lastName: "White",
        email: "kevin.white@company.com",
        department: "Engineering",
        role: "Full Stack Developer",
      },
      {
        id: 14,
        firstName: "Maria",
        lastName: "Rodriguez",
        email: "maria.rodriguez@company.com",
        department: "Marketing",
        role: "Social Media Manager",
      },
      {
        id: 15,
        firstName: "James",
        lastName: "Lee",
        email: "james.lee@company.com",
        department: "Sales",
        role: "Account Executive",
      },
    ]

    // State management
    this.filteredEmployees = [...this.employees]
    this.currentPage = 1
    this.itemsPerPage = 10
    this.searchTerm = ""
    this.filters = {
      department: "",
      role: "",
    }
    this.sortField = "firstName"
    this.sortOrder = "asc"
    this.viewMode = "grid"
    this.editingEmployee = null

    // Get unique departments and roles
    this.departments = [...new Set(this.employees.map((emp) => emp.department))].sort()
    this.roles = [...new Set(this.employees.map((emp) => emp.role))].sort()

    // Initialize the application
    this.init()
  }

  init() {
    this.populateFilterOptions()
    this.bindEvents()
    this.applyFiltersAndSort()
    this.showNotification("Employee Directory loaded successfully!", "success")
  }

  populateFilterOptions() {
    // Department filter
    const departmentFilter = document.getElementById("departmentFilter")
    const departmentSelect = document.getElementById("department")

    this.departments.forEach((dept) => {
      const option1 = document.createElement("option")
      option1.value = dept
      option1.textContent = dept
      departmentFilter.appendChild(option1)

      const option2 = document.createElement("option")
      option2.value = dept
      option2.textContent = dept
      departmentSelect.appendChild(option2)
    })

    //  role filter
    const roleFilter = document.getElementById("roleFilter")
    this.roles.forEach((role) => {
      const option = document.createElement("option")
      option.value = role
      option.textContent = role
      roleFilter.appendChild(option)
    })
  }

  bindEvents() {
    // Search functionality
    const searchInput = document.getElementById("searchInput")
    searchInput.addEventListener(
      "input",
      this.debounce((e) => {
        this.searchTerm = e.target.value
        this.applyFiltersAndSort()
      }, 300),
    )

    // Filter panel toggle
    const filterBtn = document.getElementById("filterBtn")
    const filterPanel = document.getElementById("filterPanel")
    filterBtn.addEventListener("click", () => {
      filterPanel.classList.toggle("hidden")
    })

    // Filter controls
    const departmentFilter = document.getElementById("departmentFilter")
    const roleFilter = document.getElementById("roleFilter")

    departmentFilter.addEventListener("change", (e) => {
      this.filters.department = e.target.value
      this.updateFilterCount()
    })

    roleFilter.addEventListener("change", (e) => {
      this.filters.role = e.target.value
      this.updateFilterCount()
    })

    // Filter actions
    document.getElementById("clearFiltersBtn").addEventListener("click", () => {
      this.clearFilters()
    })

    document.getElementById("applyFiltersBtn").addEventListener("click", () => {
      this.applyFiltersAndSort()
      filterPanel.classList.add("hidden")
    })

    // Sort functionality
    document.getElementById("sortSelect").addEventListener("change", (e) => {
      const [field, order] = e.target.value.split("-")
      this.sortField = field
      this.sortOrder = order
      this.applyFiltersAndSort()
    })

    // View toggle
    document.getElementById("gridViewBtn").addEventListener("click", () => {
      this.setViewMode("grid")
    })

    document.getElementById("tableViewBtn").addEventListener("click", () => {
      this.setViewMode("table")
    })

    // Items per page
    document.getElementById("itemsPerPage").addEventListener("change", (e) => {
      this.itemsPerPage = Number.parseInt(e.target.value)
      this.currentPage = 1
      this.updateDisplay()
      this.renderPagination()
    })

    // Add employee button
    document.getElementById("addEmployeeBtn").addEventListener("click", () => {
      this.openModal()
    })

    // Modal events
    this.bindModalEvents()

    // Employee action buttons (using event delegation)
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const employeeId = Number.parseInt(e.target.dataset.id)
        this.editEmployee(employeeId)
      } else if (e.target.classList.contains("delete-btn")) {
        const employeeId = Number.parseInt(e.target.dataset.id)
        this.deleteEmployee(employeeId)
      }
    })

    // Clear all filters button
    document.getElementById("clearAllBtn").addEventListener("click", () => {
      this.clearFilters()
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInput.focus()
      }

      // Escape to close modal or filter panel
      if (e.key === "Escape") {
        const modal = document.getElementById("employeeModal")
        if (!modal.classList.contains("hidden")) {
          this.closeModal()
        } else if (!filterPanel.classList.contains("hidden")) {
          filterPanel.classList.add("hidden")
        }
      }
    })
  }

  bindModalEvents() {
    const modal = document.getElementById("employeeModal")
    const closeModal = document.getElementById("closeModal")
    const cancelBtn = document.getElementById("cancelBtn")
    const employeeForm = document.getElementById("employeeForm")

    closeModal.addEventListener("click", () => {
      this.closeModal()
    })

    cancelBtn.addEventListener("click", () => {
      this.closeModal()
    })

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeModal()
      }
    })

    employeeForm.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleFormSubmit()
    })

    // Real-time form validation
    const formInputs = ["firstName", "lastName", "email", "department", "role"]
    formInputs.forEach((fieldName) => {
      const field = document.getElementById(fieldName)
      field.addEventListener("blur", () => {
        this.validateField(fieldName)
      })
      field.addEventListener("input", () => {
        this.clearFieldError(fieldName)
      })
    })
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Filter and sort functionality
  applyFiltersAndSort() {
    let filtered = [...this.employees]

    // Apply search filter
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (employee) =>
          employee.firstName.toLowerCase().includes(searchLower) ||
          employee.lastName.toLowerCase().includes(searchLower) ||
          employee.email.toLowerCase().includes(searchLower),
      )
    }

    // Apply department filter
    if (this.filters.department) {
      filtered = filtered.filter((employee) => employee.department === this.filters.department)
    }

    // Apply role filter
    if (this.filters.role) {
      filtered = filtered.filter((employee) => employee.role === this.filters.role)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[this.sortField].toLowerCase()
      const bValue = b[this.sortField].toLowerCase()

      if (this.sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    this.filteredEmployees = filtered
    this.currentPage = 1 // Reset to first page
    this.updateDisplay()
    this.updateResultsInfo()
    this.renderPagination()
  }

  clearFilters() {
    this.searchTerm = ""
    this.filters = { department: "", role: "" }

    // Reset form controls
    document.getElementById("searchInput").value = ""
    document.getElementById("departmentFilter").value = ""
    document.getElementById("roleFilter").value = ""

    this.updateFilterCount()
    this.applyFiltersAndSort()
  }

  updateFilterCount() {
    const filterCount = document.getElementById("filterCount")
    const activeFilters = Object.values(this.filters).filter((value) => value !== "").length

    if (activeFilters > 0) {
      filterCount.textContent = activeFilters
      filterCount.classList.remove("hidden")
    } else {
      filterCount.classList.add("hidden")
    }
  }

  // View mode functionality
  setViewMode(mode) {
    this.viewMode = mode

    const gridViewBtn = document.getElementById("gridViewBtn")
    const tableViewBtn = document.getElementById("tableViewBtn")
    const employeeGrid = document.getElementById("employeeGrid")
    const employeeTable = document.getElementById("employeeTable")

    if (mode === "grid") {
      gridViewBtn.classList.add("active")
      tableViewBtn.classList.remove("active")
      employeeGrid.classList.remove("hidden")
      employeeTable.classList.add("hidden")
    } else {
      tableViewBtn.classList.add("active")
      gridViewBtn.classList.remove("active")
      employeeTable.classList.remove("hidden")
      employeeGrid.classList.add("hidden")
    }

    this.updateDisplay()
  }

  // Display functionality
  updateDisplay() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    const paginatedEmployees = this.filteredEmployees.slice(startIndex, endIndex)

    // Hide/show no results message
    const noResults = document.getElementById("noResults")
    if (this.filteredEmployees.length === 0) {
      noResults.classList.remove("hidden")
      document.getElementById("employeeGrid").classList.add("hidden")
      document.getElementById("employeeTable").classList.add("hidden")
      return
    } else {
      noResults.classList.add("hidden")
      if (this.viewMode === "grid") {
        document.getElementById("employeeGrid").classList.remove("hidden")
        document.getElementById("employeeTable").classList.add("hidden")
      } else {
        document.getElementById("employeeTable").classList.remove("hidden")
        document.getElementById("employeeGrid").classList.add("hidden")
      }
    }

    if (this.viewMode === "grid") {
      this.renderGrid(paginatedEmployees)
    } else {
      this.renderTable(paginatedEmployees)
    }
  }

  renderGrid(employees) {
    const grid = document.getElementById("employeeGrid")

    grid.innerHTML = employees
      .map(
        (employee) => `
            <div class="employee-card" data-id="${employee.id}">
                <div class="card-header">
                    <div class="employee-info">
                        <h3>${this.escapeHtml(employee.firstName)} ${this.escapeHtml(employee.lastName)}</h3>
                        <p class="employee-id">ID: ${employee.id}</p>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${employee.id}" title="Edit Employee">✏️</button>
                        <button class="delete-btn" data-id="${employee.id}" title="Delete Employee">🗑️</button>
                    </div>
                </div>
                <div class="card-content">
                    <p class="employee-email">${this.escapeHtml(employee.email)}</p>
                    <div class="employee-badges">
                        <span class="badge department">${this.escapeHtml(employee.department)}</span>
                        <span class="badge role">${this.escapeHtml(employee.role)}</span>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  renderTable(employees) {
    const tbody = document.querySelector("#employeeTable tbody")

    tbody.innerHTML = employees
      .map(
        (employee) => `
            <tr data-id="${employee.id}">
                <td>${employee.id}</td>
                <td>${this.escapeHtml(employee.firstName)} ${this.escapeHtml(employee.lastName)}</td>
                <td>${this.escapeHtml(employee.email)}</td>
                <td><span class="badge department">${this.escapeHtml(employee.department)}</span></td>
                <td><span class="badge role">${this.escapeHtml(employee.role)}</span></td>
                <td>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${employee.id}" title="Edit Employee">✏️</button>
                        <button class="delete-btn" data-id="${employee.id}" title="Delete Employee">🗑️</button>
                    </div>
                </td>
            </tr>
        `,
      )
      .join("")
  }

  updateResultsInfo() {
    const resultsCount = document.getElementById("resultsCount")
    const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredEmployees.length)
    const total = this.filteredEmployees.length

    if (total === 0) {
      resultsCount.textContent = "No employees found"
    } else {
      resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} employees`
    }
  }

  // Pagination functionality
  renderPagination() {
    const pagination = document.getElementById("pagination")
    const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage)

    if (totalPages <= 1) {
      pagination.innerHTML = ""
      return
    }

    let paginationHTML = ""

    // Previous button
    paginationHTML += `
            <button ${this.currentPage === 1 ? "disabled" : ""} onclick="employeeDirectory.goToPage(${this.currentPage - 1})">
                ← Previous
            </button>
        `

    // Page numbers
    const maxVisiblePages = 5
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
                <button class="${i === this.currentPage ? "active" : ""}" onclick="employeeDirectory.goToPage(${i})">
                    ${i}
                </button>
            `
    }

    // Next button
    paginationHTML += `
            <button ${this.currentPage === totalPages ? "disabled" : ""} onclick="employeeDirectory.goToPage(${this.currentPage + 1})">
                Next →
            </button>
        `

    pagination.innerHTML = paginationHTML
  }

  goToPage(page) {
    const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage)
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page
      this.updateDisplay()
      this.updateResultsInfo()
      this.renderPagination()

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Modal functionality
  openModal(employee = null) {
    const modal = document.getElementById("employeeModal")
    const modalTitle = document.getElementById("modalTitle")
    const submitBtn = document.getElementById("submitBtn")

    this.editingEmployee = employee

    if (employee) {
      modalTitle.textContent = "Edit Employee"
      submitBtn.textContent = "Update Employee"
      this.populateForm(employee)
    } else {
      modalTitle.textContent = "Add New Employee"
      submitBtn.textContent = "Add Employee"
      this.clearForm()
    }

    modal.classList.remove("hidden")
    document.body.style.overflow = "hidden"

    // Focus first input
    setTimeout(() => {
      document.getElementById("firstName").focus()
    }, 100)
  }

  closeModal() {
    const modal = document.getElementById("employeeModal")
    modal.classList.add("hidden")
    document.body.style.overflow = ""
    this.clearForm()
    this.clearAllErrors()
    this.editingEmployee = null
  }

  populateForm(employee) {
    document.getElementById("firstName").value = employee.firstName
    document.getElementById("lastName").value = employee.lastName
    document.getElementById("email").value = employee.email
    document.getElementById("department").value = employee.department
    document.getElementById("role").value = employee.role
  }

  clearForm() {
    document.getElementById("employeeForm").reset()
  }

  // Form validation
  validateField(fieldName) {
    const field = document.getElementById(fieldName)
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ""

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!value) {
          errorMessage = `${fieldName === "firstName" ? "First" : "Last"} name is required`
          isValid = false
        }
        break

      case "email":
        if (!value) {
          errorMessage = "Email is required"
          isValid = false
        } else if (!this.isValidEmail(value)) {
          errorMessage = "Please enter a valid email address"
          isValid = false
        } else if (this.isEmailDuplicate(value)) {
          errorMessage = "An employee with this email already exists"
          isValid = false
        }
        break

      case "department":
        if (!value) {
          errorMessage = "Department is required"
          isValid = false
        }
        break

      case "role":
        if (!value) {
          errorMessage = "Role is required"
          isValid = false
        }
        break
    }

    this.displayFieldError(fieldName, errorMessage)
    return isValid
  }

  validateForm() {
    const fields = ["firstName", "lastName", "email", "department", "role"]
    let isFormValid = true

    fields.forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isFormValid = false
      }
    })

    return isFormValid
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  isEmailDuplicate(email) {
    return this.employees.some(
      (employee) =>
        employee.email.toLowerCase() === email.toLowerCase() &&
        (!this.editingEmployee || employee.id !== this.editingEmployee.id),
    )
  }

  displayFieldError(fieldName, errorMessage) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}Error`)

    if (errorMessage) {
      field.classList.add("error")
      errorElement.textContent = errorMessage
    } else {
      field.classList.remove("error")
      errorElement.textContent = ""
    }
  }

  clearFieldError(fieldName) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}Error`)

    field.classList.remove("error")
    errorElement.textContent = ""
  }

  clearAllErrors() {
    const fields = ["firstName", "lastName", "email", "department", "role"]
    fields.forEach((fieldName) => {
      this.clearFieldError(fieldName)
    })
  }

  // Form submission
  handleFormSubmit() {
    if (!this.validateForm()) {
      return
    }

    const formData = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      role: document.getElementById("role").value.trim(),
    }

    this.showLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      if (this.editingEmployee) {
        this.updateEmployee(this.editingEmployee.id, formData)
        this.showNotification("Employee updated successfully!", "success")
      } else {
        this.addEmployee(formData)
        this.showNotification("Employee added successfully!", "success")
      }

      this.showLoading(false)
      this.closeModal()
    }, 500)
  }

  // Employee CRUD operations
  addEmployee(employeeData) {
    const newEmployee = {
      id: this.getNextId(),
      ...employeeData,
    }

    this.employees.push(newEmployee)

    // Update departments and roles if new ones are added
    if (!this.departments.includes(employeeData.department)) {
      this.departments.push(employeeData.department)
      this.departments.sort()
      this.updateFilterOptions()
    }

    if (!this.roles.includes(employeeData.role)) {
      this.roles.push(employeeData.role)
      this.roles.sort()
      this.updateFilterOptions()
    }

    this.applyFiltersAndSort()
  }

  updateEmployee(id, employeeData) {
    const index = this.employees.findIndex((emp) => emp.id === id)
    if (index !== -1) {
      this.employees[index] = { ...this.employees[index], ...employeeData }

      // Update departments and roles
      this.departments = [...new Set(this.employees.map((emp) => emp.department))].sort()
      this.roles = [...new Set(this.employees.map((emp) => emp.role))].sort()
      this.updateFilterOptions()

      this.applyFiltersAndSort()
    }
  }

  editEmployee(id) {
    const employee = this.employees.find((emp) => emp.id === id)
    if (employee) {
      this.openModal(employee)
    }
  }

  deleteEmployee(id) {
    const employee = this.employees.find((emp) => emp.id === id)
    if (!employee) return

    const confirmMessage = `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
    if (confirm(confirmMessage)) {
      this.employees = this.employees.filter((emp) => emp.id !== id)

      // Update departments and roles
      this.departments = [...new Set(this.employees.map((emp) => emp.department))].sort()
      this.roles = [...new Set(this.employees.map((emp) => emp.role))].sort()
      this.updateFilterOptions()

      this.applyFiltersAndSort()
      this.showNotification("Employee deleted successfully!", "success")
    }
  }

  updateFilterOptions() {
    // Update department filter options
    const departmentFilter = document.getElementById("departmentFilter")
    const departmentSelect = document.getElementById("department")

    // Clear existing options (except first one)
    departmentFilter.innerHTML = '<option value="">All departments</option>'
    departmentSelect.innerHTML = '<option value="">Select department</option>'

    this.departments.forEach((dept) => {
      const option1 = document.createElement("option")
      option1.value = dept
      option1.textContent = dept
      departmentFilter.appendChild(option1)

      const option2 = document.createElement("option")
      option2.value = dept
      option2.textContent = dept
      departmentSelect.appendChild(option2)
    })

    // Update role filter options
    const roleFilter = document.getElementById("roleFilter")
    roleFilter.innerHTML = '<option value="">All roles</option>'

    this.roles.forEach((role) => {
      const option = document.createElement("option")
      option.value = role
      option.textContent = role
      roleFilter.appendChild(option)
    })
  }

  getNextId() {
    return Math.max(...this.employees.map((emp) => emp.id), 0) + 1
  }

  // Utility functions
  showLoading(show) {
    const loadingOverlay = document.getElementById("loadingOverlay")
    if (show) {
      loadingOverlay.classList.remove("hidden")
    } else {
      loadingOverlay.classList.add("hidden")
    }
  }

  showNotification(message, type = "info") {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    // Show notification
    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.employeeDirectory = new EmployeeDirectory()
})

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  if (window.employeeDirectory) {
    window.employeeDirectory.updateDisplay()
  }
})
