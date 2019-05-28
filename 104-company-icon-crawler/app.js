const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const baseSearchUrl = 'https://www.104.com.tw/jobs/search/'
const baseIconUrl = 'https://www.104.com.tw/upload1/logo/1104_';
const baseDataUrl = `https://www.104.com.tw/jobs/search/list?ro=0&order=11&asc=0&page=1&mode=s`;

function getCompany(page) {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.104.com.tw/jobs/search/list?ro=0&order=11&asc=0&page=${page}&mode=s`).then((res) => {
      const datas = res.data.data.list.map(company => {return {name: company.custNameRaw, custNo: company.custNo}});
      resolve(datas);
    });    
  })
}

function sleep(time) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), time));
}

async function main() {
  const companys = await getCompany(7);
  companys.forEach((company) => {
    console.log(company.name);
    axios.get(`https://www.104.com.tw/upload1/logo/1104_${company.custNo}.gif`, {responseType: 'arraybuffer'}).then((res) => {
      if (res.status === 200) {
        fs.writeFile(`./images/${company.name}.gif`, res.data, 'binary', (e) => {
          if (e) {
            // console.log(e);
          }
        });        
      }
    })
    .catch((e) => {});
  });
}

main();

