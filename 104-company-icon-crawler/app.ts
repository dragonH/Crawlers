import axios from 'axios';
import fs from 'fs';

const pages = Number(process.argv[2]) || 1;

const getCompanies = (page: number) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.104.com.tw/jobs/search/list?ro=0&order=11&asc=0&page=${page}&mode=s`)
      .then((res: any) => {
        const datas = res.data.data.list.map((company: any) => {
          return {
            name: company.custNameRaw,
            custNo: company.custNo,
          }
        });
        resolve(datas);
      })
      .catch((err) => {
        reject(err);
        return false;
      });
  });
};

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(), time));
};

const downloadIcon = (name: string, custNo: string, i: number) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.104.com.tw/upload1/logo/1104_${custNo}.gif`, { responseType: 'arraybuffer' })
      .then((res: any) => {
        console.log(`${i + 1}. ${name} - success`);
        fs.writeFile(`./icons/${name}.gif`, res.data, 'binary', (err) => {
          if (err) {
            reject(err);
            return false;
          }
          resolve();
        });
      })
      .catch((err) => {
        console.log(`${i + 1}. ${name} - fail`);
        reject(err);
      });
  });
};

const main = async () => {
  let companies: any = [];
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
    await downloadIcon(companies[i].name, companies[i].custNo, i)
      .then(() => {})
      .catch(err => console.log(err.message));
    await sleep(1000);
  }
};

main();