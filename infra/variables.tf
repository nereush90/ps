variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  default     = "europe-central2"
  description = "Primary GCP region (Cloud Run, Storage, Firestore, Artifact Registry)"
}

variable "vertex_ai_region" {
  type        = string
  default     = "europe-west4"
  description = "Vertex AI region (Gemini not available in europe-central2)"
}

variable "vertex_ai_model" {
  type        = string
  default     = "gemini-1.5-flash-002"
  description = "Vertex AI Gemini model ID"
}

variable "app_name" {
  type        = string
  default     = "docscanner"
  description = "Application name — used as prefix for GCP resource names"
}

variable "github_owner" {
  type        = string
  description = "GitHub repository owner (username or org)"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository name"
}
