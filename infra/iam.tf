resource "google_service_account" "cloud_run" {
  account_id   = "${var.app_name}-run"
  display_name = "Cloud Run — ${var.app_name}"
}

resource "google_project_iam_member" "run_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "run_firestore" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "run_vertex_ai" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Build default SA — permissions needed to deploy Cloud Run and push images
data "google_project" "project" {}

locals {
  cloud_build_sa = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}

resource "google_project_iam_member" "build_run_admin" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = local.cloud_build_sa
}

resource "google_project_iam_member" "build_sa_user" {
  project = var.project_id
  role    = "roles/iam.serviceAccountUser"
  member  = local.cloud_build_sa
}

resource "google_project_iam_member" "build_registry_writer" {
  project = var.project_id
  role    = "roles/artifactregistry.writer"
  member  = local.cloud_build_sa
}
