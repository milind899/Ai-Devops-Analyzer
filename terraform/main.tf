terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "ai_devops_server" {
  ami           = "ami-0c7217cdde317cfec"
  instance_type = "t3.micro"

  tags = {
    Name = "AIDevopsAnalyzerServer"
    Environment = "Production"
  }
}
