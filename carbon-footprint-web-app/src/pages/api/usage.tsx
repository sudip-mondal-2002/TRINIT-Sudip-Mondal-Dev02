import {NextApiRequest, NextApiResponse} from "next";
import {UsageReportController} from "../../controllers/usage/UsageReport";
import {HttpStatus} from "../../enums";
import {ReportUsageDTO} from "../../dto/Usage/ReportUsage";
import {apiHandler} from "../../middlewares/ErrorHandler";
import {ReportUsageController} from "../../controllers/usage/ReportUsage";

const handleGetRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    const usage = await UsageReportController();
    return res.status(HttpStatus.OK).json(usage);
}

const handlePostRequest = async (req: NextApiRequest, res: NextApiResponse) => {
    //key value pairs of website and usage
    const raw_usage = req.body;

    const usage: ReportUsageDTO[] = [];
    for (const [key, value] of Object.entries(raw_usage)) {
        usage.push({website_origin: key, website_usage: value as number});
    }

    await ReportUsageController(usage);

    return res.status(HttpStatus.OK).end();
}

export default apiHandler({
    GET: handleGetRequest,
    POST: handlePostRequest
})