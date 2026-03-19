
```
nexsol_crm
├─ crm
│  ├─ app
│  │  ├─ admins
│  │  │  ├─ achievements
│  │  │  │  └─ page.tsx
│  │  │  ├─ advertisements
│  │  │  │  └─ page.tsx
│  │  │  ├─ calculators
│  │  │  │  └─ page.tsx
│  │  │  ├─ clients
│  │  │  │  └─ page.tsx
│  │  │  ├─ documentation
│  │  │  │  └─ page.tsx
│  │  │  ├─ finance
│  │  │  │  └─ page.tsx
│  │  │  ├─ funnels
│  │  │  │  └─ page.tsx
│  │  │  ├─ ideas
│  │  │  │  └─ page.tsx
│  │  │  ├─ leads
│  │  │  │  └─ page.tsx
│  │  │  ├─ nexsol-ai
│  │  │  │  └─ page.tsx
│  │  │  ├─ notes
│  │  │  │  └─ page.tsx
│  │  │  ├─ responsibilities
│  │  │  │  └─ page.tsx
│  │  │  ├─ text-templates
│  │  │  │  └─ page.tsx
│  │  │  ├─ time
│  │  │  │  └─ page.tsx
│  │  │  └─ tools
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ achievements
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ logout
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ me
│  │  │  │     └─ route.ts
│  │  │  ├─ clients
│  │  │  │  ├─ route.ts
│  │  │  │  ├─ stats
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ crm
│  │  │  │  └─ clients
│  │  │  │     └─ route.ts
│  │  │  ├─ director
│  │  │  │  ├─ announcements
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ funnels
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ links
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ responsibilities
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  ├─ tools
│  │  │  │  │  ├─ route.ts
│  │  │  │  │  └─ [id]
│  │  │  │  │     └─ route.ts
│  │  │  │  └─ users
│  │  │  │     ├─ route.ts
│  │  │  │     └─ [id]
│  │  │  │        └─ route.ts
│  │  │  ├─ finance
│  │  │  │  ├─ expenses
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ incomes
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ planned
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ stats
│  │  │  │     └─ route.ts
│  │  │  ├─ ideas
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ leads
│  │  │  │  └─ manage
│  │  │  │     ├─ route.ts
│  │  │  │     └─ stats
│  │  │  │        └─ route.ts
│  │  │  ├─ notes
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ openrouter
│  │  │  │  └─ route.ts
│  │  │  ├─ stats
│  │  │  │  └─ route.ts
│  │  │  ├─ templates
│  │  │  │  ├─ route.ts
│  │  │  │  └─ [id]
│  │  │  │     └─ route.ts
│  │  │  ├─ time
│  │  │  │  ├─ active
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ route.ts
│  │  │  │  └─ stats
│  │  │  │     └─ route.ts
│  │  │  ├─ tools
│  │  │  │  └─ route.ts
│  │  │  ├─ users
│  │  │  │  └─ route.ts
│  │  │  └─ visitors
│  │  │     ├─ charts
│  │  │     │  └─ route.ts
│  │  │     └─ recent
│  │  │        └─ route.ts
│  │  ├─ components
│  │  │  ├─ dashboard
│  │  │  │  └─ dashboard.tsx
│  │  │  ├─ main
│  │  │  │  └─ main.tsx
│  │  │  └─ template
│  │  │     └─ template.tsx
│  │  ├─ director
│  │  │  ├─ announce
│  │  │  │  └─ page.tsx
│  │  │  ├─ funnels
│  │  │  │  └─ page.tsx
│  │  │  ├─ leads
│  │  │  │  └─ page.tsx
│  │  │  ├─ links
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ responsibilities
│  │  │  │  └─ page.tsx
│  │  │  ├─ site
│  │  │  │  └─ page.tsx
│  │  │  ├─ tools
│  │  │  │  └─ page.tsx
│  │  │  └─ users
│  │  │     └─ page.tsx
│  │  ├─ director-login
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  ├─ LoginForm.tsx
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  └─ styles
│  │     ├─ achievements
│  │     │  └─ achievements.scss
│  │     ├─ advertisements
│  │     │  └─ advertisements.scss
│  │     ├─ calculators
│  │     │  └─ calculators.scss
│  │     ├─ chat
│  │     │  └─ chat.scss
│  │     ├─ clients
│  │     │  └─ clietns.scss
│  │     ├─ colors
│  │     │  └─ colors.scss
│  │     ├─ dashboard
│  │     │  └─ dashboard.scss
│  │     ├─ director
│  │     │  ├─ announce.scss
│  │     │  ├─ director.scss
│  │     │  ├─ funnels.scss
│  │     │  ├─ leads.scss
│  │     │  ├─ links.scss
│  │     │  ├─ login.scss
│  │     │  ├─ responsibilities.scss
│  │     │  ├─ tools.scss
│  │     │  └─ users.scss
│  │     ├─ documentation
│  │     │  └─ documentation.scss
│  │     ├─ finance
│  │     │  └─ finance.scss
│  │     ├─ funnels
│  │     │  └─ funnels.scss
│  │     ├─ home
│  │     │  └─ home.scss
│  │     ├─ ideas
│  │     │  └─ ideas.scss
│  │     ├─ leads
│  │     │  └─ leads.scss
│  │     ├─ login
│  │     │  └─ login.scss
│  │     ├─ main
│  │     │  └─ main.scss
│  │     ├─ mixins
│  │     │  └─ mixins.scss
│  │     ├─ notes
│  │     │  └─ notes.scss
│  │     ├─ reset
│  │     │  └─ reset.scss
│  │     ├─ responsibilities
│  │     │  └─ responsibilities.scss
│  │     ├─ template-back
│  │     │  └─ templateBack.scss
│  │     ├─ text-templates
│  │     │  └─ textTemplates.scss
│  │     ├─ time
│  │     │  └─ time.scss
│  │     └─ tools
│  │        └─ tools.scss
│  ├─ data
│  │  ├─ calculators.data.ts
│  │  ├─ dashboard.data.ts
│  │  └─ directorModules.ts
│  ├─ eslint.config.mjs
│  ├─ lib
│  │  └─ mongodb
│  │     ├─ index.ts
│  │     └─ models
│  │        └─ crm
│  │           ├─ achievement.ts
│  │           ├─ announcement.ts
│  │           ├─ client.ts
│  │           ├─ clientCrm.ts
│  │           ├─ finance.ts
│  │           ├─ finances.ts
│  │           ├─ funnel.ts
│  │           ├─ idea.ts
│  │           ├─ lead.ts
│  │           ├─ link.ts
│  │           ├─ note.ts
│  │           ├─ project.ts
│  │           ├─ responsibility.ts
│  │           ├─ template.ts
│  │           ├─ time.ts
│  │           ├─ tools.ts
│  │           └─ users.ts
│  ├─ next-env.d.ts
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ proxy.ts
│  ├─ public
│  ├─ README.md
│  ├─ tsconfig.json
│  └─ types
│     ├─ achievement.type.ts
│     ├─ announcement.type.ts
│     ├─ client.type.ts
│     ├─ costItem.type.ts
│     ├─ dashboard.type.ts
│     ├─ declaration.d.ts
│     ├─ directorLead.type.ts
│     ├─ directorLink.type.ts
│     ├─ directorModules.type.ts
│     ├─ directorResponsibility.type.ts
│     ├─ directorTool.type.ts
│     ├─ directorUser.type.ts
│     ├─ finance.type.ts
│     ├─ funnels.type.ts
│     ├─ ideas.type.ts
│     ├─ lead.type.ts
│     ├─ mainVisitors.type.ts
│     ├─ message.type.ts
│     ├─ notes.type.ts
│     ├─ textTemplate.type.ts
│     ├─ timeEntry.type.ts
│     ├─ tool.type.ts
│     └─ user.type.ts
└─ README.md

```