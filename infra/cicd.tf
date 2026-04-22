resource "google_cloudbuild_trigger" "deploy" {
  name     = "${var.app_name}-deploy"
  location = "global"

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"

  substitutions = {
    _REGION   = var.region
    _APP_NAME = var.app_name
  }

  depends_on = [google_project_service.apis]
}
