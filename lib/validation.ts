// lib/validation.ts

export interface ValidationErrors {
  [key: string]: string;
}

// ============= EMPLOYEE VALIDATION =============
export interface EmployeeFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string; // Changed from "position"
  joinDate: string; // Changed from "hireDate"
  status: string;
  active?: boolean;
  targetQARPerMonth?: number;
  actions?: string;
}

export function validateEmployee(data: EmployeeFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Invalid email format (e.g., user@example.com)";
  }

  // Phone validation (8-12 digits)
  if (!data.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^\d{8,12}$/.test(data.phone.replace(/[\s\-\(\)]/g, ""))) {
    errors.phone = "Phone must be 8-12 digits";
  }

  // Department validation
  if (!data.department || data.department === "") {
    errors.department = "Please select a department";
  }

  // Role validation (changed from position)
  if (!data.role.trim()) {
    errors.role = "Position is required";
  }

  // Join date validation (changed from hireDate)
  if (!data.joinDate) {
    errors.joinDate = "Join date is required";
  } else {
    const joinDate = new Date(data.joinDate);
    const today = new Date();
    if (joinDate > today) {
      errors.joinDate = "Join date cannot be in the future";
    }
  }

  // Status validation
  if (!data.status) {
    errors.status = "Please select a status";
  }

  return errors;
}
// ============= OPPORTUNITY VALIDATION =============
export interface OpportunityFormData {
  id?: string;
  customerName: string;
  assignedTo: string;
  stage: string;
  probability: number | string;
  expectedValueQAR: number | string;
  expectedCloseDate: string;
  category: string;
  notes?: string;
}

export function validateOpportunity(data: OpportunityFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Customer name validation
  if (!data.customerName.trim()) {
    errors.customerName = "Customer name is required";
  } else if (data.customerName.trim().length < 2) {
    errors.customerName = "Customer name must be at least 2 characters";
  }

  // Assigned to validation
  if (!data.assignedTo || data.assignedTo === "") {
    errors.assignedTo = "Please assign to an employee";
  }

  // Stage validation
  if (!data.stage || data.stage === "") {
    errors.stage = "Please select a stage";
  }

  // Probability validation (0-100)
  const prob = Number(data.probability);
  if (data.probability === "" || data.probability === null || data.probability === undefined) {
    errors.probability = "Probability is required";
  } else if (isNaN(prob)) {
    errors.probability = "Probability must be a number";
  } else if (prob < 0 || prob > 100) {
    errors.probability = "Probability must be between 0 and 100";
  }

  // Expected value validation (must be positive)
  const value = Number(data.expectedValueQAR);
  if (data.expectedValueQAR === "" || data.expectedValueQAR === null || data.expectedValueQAR === undefined) {
    errors.expectedValueQAR = "Expected value is required";
  } else if (isNaN(value)) {
    errors.expectedValueQAR = "Expected value must be a number";
  } else if (value <= 0) {
    errors.expectedValueQAR = "Expected value must be greater than 0";
  }

  // Expected close date validation
  if (!data.expectedCloseDate) {
    errors.expectedCloseDate = "Expected close date is required";
  } else {
    const closeDate = new Date(data.expectedCloseDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (closeDate < today) {
      errors.expectedCloseDate = "Expected close date should not be in the past";
    }
  }

  // Category validation
  if (!data.category || data.category === "") {
    errors.category = "Please select a category";
  }

  return errors;
}

// ============= SALES ORDER VALIDATION =============
export interface SalesOrderFormData {
  id?: string;
  customer: string;
  employee: string;
  productService: string;
  category: string;
  amountQAR: number | string;
  costQAR: number | string;
  dealCloseDate: string;
  paymentStatus: string;
}

export function validateSalesOrder(data: SalesOrderFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  // Customer validation
  if (!data.customer.trim()) {
    errors.customer = "Customer name is required";
  } else if (data.customer.trim().length < 2) {
    errors.customer = "Customer name must be at least 2 characters";
  }

  // Employee validation
  if (!data.employee || data.employee === "") {
    errors.employee = "Please select an employee";
  }

  // Product/Service validation
  if (!data.productService.trim()) {
    errors.productService = "Product/Service is required";
  }

  // Category validation
  if (!data.category || data.category === "") {
    errors.category = "Please select a category";
  }

  // Amount validation (must be positive)
  const amount = Number(data.amountQAR);
  if (data.amountQAR === "" || data.amountQAR === null || data.amountQAR === undefined) {
    errors.amountQAR = "Amount is required";
  } else if (isNaN(amount)) {
    errors.amountQAR = "Amount must be a number";
  } else if (amount <= 0) {
    errors.amountQAR = "Amount must be greater than 0";
  }

  // Cost validation (must be positive and less than amount)
  const cost = Number(data.costQAR);
  if (data.costQAR === "" || data.costQAR === null || data.costQAR === undefined) {
    errors.costQAR = "Cost is required";
  } else if (isNaN(cost)) {
    errors.costQAR = "Cost must be a number";
  } else if (cost < 0) {
    errors.costQAR = "Cost cannot be negative";
  } else if (cost > amount) {
    errors.costQAR = "Cost cannot exceed amount (would result in negative GP)";
  }

  // Deal close date validation
  if (!data.dealCloseDate) {
    errors.dealCloseDate = "Deal close date is required";
  }

  // Payment status validation
  if (!data.paymentStatus || data.paymentStatus === "") {
    errors.paymentStatus = "Please select payment status";
  }

  return errors;
}

// ============= LOGIN VALIDATION =============
export interface LoginFormData {
  username: string;
  password: string;
}

export function validateLogin(data: LoginFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.username.trim()) {
    errors.username = "Username is required";
  }

  if (!data.password.trim()) {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}