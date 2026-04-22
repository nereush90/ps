#!/bin/bash
set -euo pipefail

# Only run in remote Claude Code environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

install_terraform() {
  if command -v terraform &>/dev/null; then
    echo "terraform already installed: $(terraform version -json 2>/dev/null | grep '"terraform_version"' | head -1 || terraform version | head -1)"
    return
  fi

  echo "Installing Terraform..."
  TERRAFORM_VERSION="1.10.5"
  ARCH="amd64"
  curl -fsSL "https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_${ARCH}.zip" \
    -o /tmp/terraform.zip
  unzip -o /tmp/terraform.zip -d /tmp/terraform_bin
  sudo mv /tmp/terraform_bin/terraform /usr/local/bin/terraform
  rm -rf /tmp/terraform.zip /tmp/terraform_bin
  echo "Terraform installed: $(terraform version | head -1)"
}

install_gcloud() {
  if command -v gcloud &>/dev/null; then
    echo "gcloud already installed: $(gcloud version 2>/dev/null | head -1)"
    return
  fi

  echo "Installing Google Cloud CLI..."
  curl -fsSL "https://storage.googleapis.com/cloud-sdk-release/google-cloud-cli-linux-x86_64.tar.gz" \
    -o /tmp/google-cloud-sdk.tar.gz
  sudo tar -xzf /tmp/google-cloud-sdk.tar.gz -C /usr/local/
  /usr/local/google-cloud-sdk/install.sh --quiet --path-update=false
  sudo ln -sf /usr/local/google-cloud-sdk/bin/gcloud /usr/local/bin/gcloud
  sudo ln -sf /usr/local/google-cloud-sdk/bin/gsutil /usr/local/bin/gsutil
  sudo ln -sf /usr/local/google-cloud-sdk/bin/bq /usr/local/bin/bq
  rm -f /tmp/google-cloud-sdk.tar.gz
  echo "gcloud installed: $(gcloud version | head -1)"
}

install_terraform
install_gcloud
