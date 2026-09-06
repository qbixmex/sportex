import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getTemplate() {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
          <title>Sportex Backend</title>
          <style>
            :root {
              --color-red: #ef4444;
              --color-purple: #a855f7;
              --color-blue: #3b82f6;
              --color-orange: #f97316;
              --color-green: #10b981;
              --color-gray: #6b7280;
              --color-light: #fafafa;
              --color-dark: #0a0a0a;
            }

            * {
              padding: 0;
              margin: 0;
            }

            body {
              min-height: 100dvh;
              background-color: var(--color-dark);
              color: var(--color-light);
              font-family: "Open Sans", sans-serif;
              display: grid;
              place-content: center;
            }

            h1 {
              font-size: 3rem;
              font-weight: 900;
              color: var(--color-blue);
              margin-bottom: 8px;
            }

            main {
              padding: 16px;
              text-align: center;
            }

            p {
              color: var(--color-gray);
            }
          </style>
        </head>
        <body>
          <main>
            <h1>Sportex Backend</h1>
            <p>Plataforma para la gestión de deportes 🏀🏈⚽️</p>
          </main>
        </body>
      </html>
    `;
  }
}