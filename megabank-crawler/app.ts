import puppeteer from 'puppeteer';

(async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ebank.megabank.com.tw/global2/rs/rs03/PRS3000.faces');
  await page.select('#main\\:currency', '01');
  await page.click('#main\\:j_id31');
  await page.waitForNavigation();
  const header = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('.head_td'));
    return tds.map(td => td.innerHTML.trim());
  });
  const values = await page.evaluate(() => {
    const tds = Array.from(document.querySelectorAll('.con_td'));
    return tds.map(td => td.innerHTML.trim());
  });
  const result = header
    .map((data, index) => { return { title: header[index], value: values[index] } })
    .filter(data => data.title !== '');
  console.log(result);
  await browser.close();
})();