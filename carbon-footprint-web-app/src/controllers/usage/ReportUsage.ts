import {ReportUsageDTO} from "../../dto/Usage/ReportUsage";
import prisma from "../../libs/prisma";
import crypto from "crypto";
import {DatabaseConnectionError} from "../../errors/api";
export async function ReportUsageController(usage:ReportUsageDTO[]){
    const usage_data = usage.map((use:ReportUsageDTO) => {
        return {
            website_origin: use.website_origin,
            website_usage: use.website_usage/(1024*1024),
            report_id: crypto.randomUUID()
        }
    })
    let usage_saved
    try{
        usage_saved = await prisma.usage.createMany({
            data: usage_data
        })
    } catch (e) {
        throw new DatabaseConnectionError()
    }
    return usage_saved;
}