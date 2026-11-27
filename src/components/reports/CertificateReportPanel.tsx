"use client";

import { useMemo, useState } from "react";
import { Download, FolderOpen } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  SearchBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import { downloadCsv } from "@/data/mock/hrdReportsPart1";
import type { CertificateReportRow } from "@/data/mock/hrdReportsPart2";

interface CertificateReportPanelProps {
  rows: CertificateReportRow[];
  onNotify: (message: string) => void;
}

export function CertificateReportPanel({ rows, onNotify }: CertificateReportPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.certCode.toLowerCase().includes(q) ||
        r.categoryName.toLowerCase().includes(q) ||
        r.source.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleExport = () => {
    downloadCsv(
      "hrd-certificate-report-2569.csv",
      ["รหัสหมวด", "กลุ่มใบประกาศนียบัตร/ใบรับรอง", "แหล่งที่มา", "ออกแล้วทั้งหมด", "ใช้งานได้", "ใกล้หมดอายุ", "หมดอายุแล้ว"],
      filtered.map((r) => [
        r.certCode,
        r.categoryName,
        r.source,
        r.issuedCount,
        r.validCount,
        r.expiringCount,
        r.expiredCount,
      ])
    );
    onNotify("ส่งออกรายงานใบประกาศนียบัตรและใบรับรอง (CSV) เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อกลุ่มใบประกาศนียบัตร หรือแหล่งที่มา..."
          className="w-full sm:w-80"
        />
        <Tooltip content="ดาวน์โหลดรายงานสรุปใบประกาศนียบัตรและใบรับรองเป็นไฟล์ CSV">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            ส่งออก CSV
          </Button>
        </Tooltip>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบข้อมูลรายงานใบประกาศนียบัตร"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[34%]">รหัส / กลุ่มใบประกาศนียบัตร</TableHead>
                <TableHead className="w-[18%] text-center">แหล่งที่มา</TableHead>
                <TableHead className="w-[12%] text-center">ออกแล้วทั้งหมด</TableHead>
                <TableHead className="w-[12%] text-center">ใช้งานได้</TableHead>
                <TableHead className="w-[12%] text-center">ใกล้หมดอายุ</TableHead>
                <TableHead className="w-[12%] text-center">หมดอายุแล้ว</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {row.certCode}
                    </span>
                    <div className="mt-1 font-semibold text-[#1E293B]">{row.categoryName}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={row.source === "LMS ภายในองค์กร" ? "primary" : "neutral"}
                    >
                      {row.source}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-[#1E293B]">
                    {row.issuedCount} ใบ
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip content="ใบรับรองที่ยังมีผลบังคับใช้งานได้ปกติ">
                      <Badge variant="success">{row.validCount} ใบ</Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip
                      content={
                        row.expiringCount > 0
                          ? "ใบรับรองที่จะหมดอายุภายใน 90 วัน ควรแจ้งเตือนพนักงานต่ออายุ"
                          : "ไม่มีใบรับรองใกล้หมดอายุในกลุ่มนี้"
                      }
                    >
                      <Badge variant={row.expiringCount > 0 ? "warning" : "neutral"}>
                        {row.expiringCount} ใบ
                      </Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip
                      content={
                        row.expiredCount > 0
                          ? "ใบรับรองหมดอายุแล้ว รอการสอบต่ออายุ (Renewal)"
                          : "ไม่มีใบรับรองหมดอายุในกลุ่มนี้"
                      }
                    >
                      <Badge variant={row.expiredCount > 0 ? "danger" : "neutral"}>
                        {row.expiredCount} ใบ
                      </Badge>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
