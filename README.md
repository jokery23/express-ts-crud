# Express, Typescript, CRUD

### Install

```bash
    npm install
```

### Post install

```bash
    npm run prepare
```

### Config husky

```bash
    npx husky add .husky/pre-commit "npm run lint"
```

### Run up all seeds

```bash
    npx sequelize-cli db:seed:all
```

### Run down for all seeds

```bash
    npx sequelize-cli db:seed:undo
```