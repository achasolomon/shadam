# SMHI Platform — Governance to Platform Mapping

**Version:** 1.0  
**Date:** September 2026  
**Author:** Lead Software Engineer  
**Status:** Approved

---

## 1. Overview

This document maps the governance structure from the SHEDAM Founding and Governance Document to the platform's roles, features, and content structure.

## 2. Governance Structure → Platform Roles

### 2.1 Organizational Roles → CMS Roles

| Governance Role | Platform CMS Role | Access Level |
|----------------|-------------------|--------------|
| Board of Directors | Super Admin (read-only) | View all, no editing |
| Executive Director | Super Admin | Full access |
| Programme Manager | Content Manager | Content CRUD + publish |
| Communications Manager | Content Manager + Media Manager | Content + media |
| ICT Officer | Super Admin (technical) | Full access + settings |
| Volunteers Coordinator | Read Only + limited create | View + create limited content |
| Research Officer | Content Manager (articles) | Articles + resources |
| Support Officer | Support Officer | Enquiries only |
| Media Volunteers | Media Manager | Media + gallery only |
| Committee Members | Read Only | View content status |

### 2.2 Committee Mapping to Platform Features

| Committee | Platform Features |
|-----------|-------------------|
| Budget & Finance | Donation tracking, financial reports |
| Publicity & Communications | Content management, social media links |
| Entertainment & Logistics | Event management, registration |
| Security | User management, audit logs |
| Technical | Content review, publishing approval |
| M&E | Analytics, reporting dashboards |

## 3. Areas of Intervention → Service Categories

| Governance Area | Platform Service Page | Content Type |
|----------------|----------------------|--------------|
| Mental Health Awareness | Mental Health Awareness | Articles, Events |
| Professional Referral | Professional Referral | Resources, Get Help |
| Psycho-Spiritual Care | Community Support | Stories, Resources |
| Indigent Support | Vulnerable Persons Support | Projects, Resources |
| Rescue & Rehabilitation | Vulnerable Persons Support | Stories, Projects |
| School Programs | Mental Health Education | Articles, Events |
| Workforce Development | Mental Health Education | Resources, Team |
| Research & Advocacy | Insights | Articles, Research |
| Crisis Intervention | Get Help | Emergency Resources |

## 4. Data Protection Requirements → Platform Security

| Governance Requirement | Platform Implementation |
|----------------------|------------------------|
| Confidentiality | RBAC, encrypted storage, audit logs |
| Consent management | Story consent workflow |
| Data minimization | Collect only necessary data |
| Access control | Role-based permissions |
| Audit trail | Audit log for all actions |
| Secure storage | HTTPS, encrypted passwords |

## 5. Content Governance → Publishing Workflow

| Governance Requirement | Platform Feature |
|----------------------|------------------|
| Content review | Draft → Review → Approved workflow |
| Sensitive content | Consent verification for stories |
| Crisis escalation | Enquiry escalation workflow |
| Professional review | Editorial review before publish |
| Unauthorized publication | RBAC prevents unreviewed publish |

## 6. Reporting Requirements → Dashboard Features

| Governance Need | Dashboard Feature |
|----------------|-------------------|
| Activity reports | Audit log viewer |
| Programme impact | Content statistics |
| Enquiry tracking | Enquiries dashboard |
| Event participation | Event registration data |
| Media coverage | Media library stats |

## 7. Volunteer Network → Platform Features

| Governance Need | Platform Feature |
|----------------|------------------|
| Ambassador management | Team member profiles |
| Volunteer registration | Get Involved form |
| Volunteer tracking | Enquiry assignment |
| Community volunteers | Community support content |

## 8. Compliance Checklist

### 8.1 Legal Compliance
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Cookie consent mechanism
- [ ] Data retention policy
- [ ] Right to deletion

### 8.2 Governance Compliance
- [ ] RBAC enforced
- [ ] Audit logs active
- [ ] Content review workflow
- [ ] Consent management
- [ ] Financial transparency

### 8.3 Safeguarding Compliance
- [ ] Vulnerable person protection
- [ ] Crisis escalation workflow
- [ ] Content moderation
- [ ] Report mechanism
- [ ] Incident logging
