## Beat Bazaar

Инструкции для локального запуска и разработки.

### Предварительные требования
- Node.js 18+ и npm (рекомендуется установка через [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Установка и запуск в dev-режиме
```sh
git clone <REPO_URL>
cd beat-bazaar-pro
npm install
npm run dev
```
Dev-сервер (Vite) стартует на `http://localhost:5173` по умолчанию.

### Сборка production-версии
```sh
npm run build
npm run preview   # локальный просмотр собранной версии
```

### Технологии
Проект-прототип площадки по продаже музыкальных композиций, сделанный на стеке технологий:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

Покупатель: artist@beatmarket.ru / buyer123
Продавец: producer@beatmarket.ru / seller123
Админ: admin@beatmarket.ru / admin123

Покупатель: aleksey@gmail.com / 123456
Продавец: anton@gmail.com / 123456
