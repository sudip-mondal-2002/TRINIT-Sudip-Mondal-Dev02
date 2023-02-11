import prisma from "../../libs/prisma";
import {DatabaseConnectionError} from "../../errors/api";
import {UsageReportDTO} from "../../dto/Usage/UsageReport";

export async function UsageReportController(){
    let usage
    try {
        usage = await prisma.usage.groupBy({
            by: ['website_origin'],
            _sum: {
                website_usage: true
            },
            _count: {
                _all : true
            }
        })
    } catch (e) {
        console.log(e)
        throw new DatabaseConnectionError()
    }
    const usage_report: UsageReportDTO[] = []
    usage.forEach((use: any) => {
        usage_report.push({
            website_origin: use.website_origin,
            website_total_usage: (use._sum.website_usage*11)/(1024*1000),
            website_report_count: use._count._all
        })
    })
    return usage_report;
}