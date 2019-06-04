const axios = require('axios');
const fs = require('fs');
const pages = Number(process.argv[2]) || 1;

function getCompanies(page) {
  return new Promise((resolve) => {
    axios.get(`https://www.104.com.tw/jobs/search/list?ro=0&order=11&asc=0&page=${page}&mode=s`)
      .then((res) => {
        const datas = res.data.data.list.map(company => {
          return { name: company.custNameRaw, custNo: company.custNo }
        });
        resolve(datas);
      });    
  });
};

function sleep(time) {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), time));
};

function downloadIcon(name, custNo, i) {
  return new Promise((resolve) => {
    axios.get(`https://www.104.com.tw/upload1/logo/1104_${custNo}.gif`, {responseType: 'arraybuffer'})
      .then((res) => {
        console.log(`${i + 1}. ${name} - success`);
        fs.writeFile(`./icons/${name}.gif`, res.data, 'binary', (e) => {
          if (e) {
            console.log(e);
          }
          resolve();
        });
      })
      .catch((e) => {
        console.log(`${i + 1}. ${name} - fail`);
        resolve();
      });
  });
}

async function main() {
  let companies = [];
  for (let i = 1; i <= pages; i += 1) {
    console.log(`---Page ${i}---`);
    companies.push(await getCompanies(i));
    await sleep(1000);
  } 
  if (!fs.existsSync('./icons')) {
    fs.mkdirSync('./icons');
  }
  companies = [].concat(...companies);
  console.log(`Total: ${companies.length} companies`);
  for (let i = 0; i < companies.length; i += 1) {
    await downloadIcon(companies[i].name, companies[i].custNo, i);
    await sleep(1000);   
  }
}

main();