resource "google_storage_bucket" "documents" {
  name          = "${var.project_id}-documents"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition { age = 365 }
    action { type = "Delete" }
  }

  depends_on = [google_project_service.apis]
}
