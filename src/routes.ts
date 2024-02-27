import { Dataset, createPlaywrightRouter } from 'crawlee';

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ request, page, log }) => {

    const url = request.url;
    log.debug(`Handling request for ${url}`);

    // wait page to load 
    await page.waitForLoadState('networkidle', { timeout: 0 });
 
    const title = await page.title();

    // get jobResults li elements and extract the job title and job url and push to jobs array 
    const jobResults =  () => {
        const jobs:any = [];
        const jobList = document.querySelectorAll('.p-view-jobsearchresults div');
        jobList.forEach((job) => {
            const jobTitle = (job.querySelector('a[data-tag="displayJobTitle"] p') as HTMLParagraphElement)?.textContent;
            const jobUrl = (job.querySelector('a[data-tag="displayJobTitle"]') as HTMLAnchorElement)?.href;
            if(jobTitle && jobUrl)
            jobs.push({jobTitle, jobUrl});
        });
        return jobs;
    }


    const jobs = await page.evaluate(jobResults);

    await Dataset.pushData({
        url,
        title,
        jobs : jobs
    });

    log.debug(`Pushed data for ${url}`);


});

