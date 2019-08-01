import puppeteer from 'puppeteer';
import fs from 'fs';

const baseUrl = 'https://ithelp.ithome.com.tw/questions?page=';
const pages = Number(process.argv[2]) || 1;

const crawlPage = (pageNum: number) => {
  return new Promise(async (resolve, reject) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${baseUrl}${pageNum}`);
    const questionsList = await page.evaluate(() => {
      const questions = Array.from(document.querySelectorAll('.qa-list'))
      return questions.map((question: any) => {
        return {
          title: question.querySelector('.qa-list__title a').innerHTML.trim(),
          asker: question.querySelector('.qa-list__info-link') 
            ? question.querySelector('.qa-list__info-link').innerHTML.trim()
            : '匿名',
          setBestAnswer: question.querySelectorAll('.qa-condition--had-answer').length
            ? true
            : false,
        }
      });
    });
    await browser.close();
    resolve(questionsList);
  });
};

const main = async (pages: number) => {
  for (let i = 0; i < pages; i += 1 ) {
    const startTime = Date.now();
    const result = await crawlPage(i);
    await fs.appendFile('result.json', JSON.stringify(result), (err) => {
      if (err) {
        console.log(err);
      }
    });
    console.log(`------Page ${'0'.repeat(String(pages).length - String(i).length)}${i}------(${Date.now() - startTime} ms)`);
  }
};

main(pages);