output "cloud_run_url" {
  description = "Public URL of the Cloud Run service"
  value       = google_cloud_run_v2_service.app.uri
}

output "artifact_registry_repo" {
  description = "Docker image path prefix for Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${var.app_name}"
}

output "storage_bucket" {
  description = "Cloud Storage bucket for document images"
  value       = google_storage_bucket.documents.name
}

output "cloud_run_sa" {
  description = "Service account email used by Cloud Run"
  value       = google_service_account.cloud_run.email
}
