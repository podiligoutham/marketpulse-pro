# AWS Deployment Plan — Not Yet Provisioned

## Target architecture
- React production build -> private S3 origin -> CloudFront + Origin Access Control.
- Spring Boot API -> container image in ECR -> ECS/Fargate (candidate; evaluate alternatives for cost).
- PostgreSQL -> RDS only when justified; use local Docker PostgreSQL during development.
- TLS, DNS, environment-specific configuration, IAM roles, CloudWatch logs/alarms.
- Secrets in Secrets Manager/SSM with least privilege; never expose to frontend.
- GitHub Actions for lint/test/build and controlled deploys; prefer GitHub OIDC instead of static AWS keys.

## Stages
1. Local Docker Compose development and CI.
2. Deploy static frontend with mock API.
3. Deploy backend with minimal safe configuration.
4. Introduce managed database and provider credentials.
5. Add monitoring, backup/restore validation, and operational runbook.

## Cost controls
Set AWS Budgets and alerts before provisioning. Estimate monthly costs for ECS/Fargate, ALB, RDS, NAT gateways, data transfer, CloudFront, logs, and Secrets Manager. NAT/ALB/RDS can dominate small-project costs. Consider cheaper architecture for MVP. No resources or paid services without explicit approval.

## Security checklist
- No credentials in repository, logs, or client bundles.
- Least-privilege IAM, private database, TLS everywhere.
- Pin and scan dependencies/container images.
- Limit CORS origins and rate-limit public endpoints.
- Document data-provider licensing and redistribution constraints.
- Monitor spend and create teardown instructions.

## Definition of deployed
Publicly reachable app, verified health checks, repeatable CI/CD, alarms, secrets handling, backups where relevant, rollback procedure, and actual cost observation.
