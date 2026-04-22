resource "google_cloud_run_v2_service" "app" {
  name     = var.app_name
  location = var.region

  deletion_protection = false

  template {
    service_account = google_service_account.cloud_run.email

    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }

    timeout = "60s"

    containers {
      # Placeholder until first real build is pushed via Cloud Build
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "STORAGE_BUCKET"
        value = google_storage_bucket.documents.name
      }
      env {
        name  = "VERTEX_AI_LOCATION"
        value = var.vertex_ai_region
      }
      env {
        name  = "VERTEX_AI_MODEL"
        value = var.vertex_ai_model
      }
      env {
        name  = "FIRESTORE_COLLECTION"
        value = "documents"
      }
    }
  }

  depends_on = [
    google_project_service.apis,
    google_artifact_registry_repository.docker,
  ]

  lifecycle {
    # Cloud Build updates the image on every deploy — Terraform should not revert it
    ignore_changes = [template[0].containers[0].image]
  }
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  name     = google_cloud_run_v2_service.app.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
