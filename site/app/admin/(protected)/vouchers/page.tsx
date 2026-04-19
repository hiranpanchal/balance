import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Gift vouchers" };
export const dynamic = "force-dynamic";

export default async function VouchersPage() {
  const vouchers = await db.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });

  const paid = vouchers.filter((v) => v.paid);
  const totalIssued = paid.reduce((sum, v) => sum + v.amountPence, 0);
  const redeemed = paid.filter((v) => v.redeemedAt);
  const totalRedeemed = redeemed.reduce((sum, v) => sum + v.amountPence, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-[28px] text-[#3E4F56] font-normal">Gift vouchers</h1>
        <p className="text-[13px] text-[#A09687] mt-1">{paid.length} issued</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">{paid.length}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Issued</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">£{totalIssued / 100}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Total value</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-[22px] font-serif text-[#3E4F56]">£{totalRedeemed / 100}</div>
          <div className="text-[11px] tracking-[0.1em] text-[#A09687] uppercase mt-1">Redeemed</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#EAE2D2]">
              {["Code", "Amount", "Purchaser", "Recipient", "Status", "Expires"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[11px] tracking-[0.1em] uppercase text-[#A09687] px-5 py-4 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vouchers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#A09687]">
                  No vouchers yet.
                </td>
              </tr>
            )}
            {vouchers.map((v) => {
              const expired = new Date() > v.expiresAt;
              const status = !v.paid
                ? { label: "Unpaid", cls: "bg-[#3E4F56]/10 text-[#3E4F56]" }
                : v.redeemedAt
                ? { label: "Redeemed", cls: "bg-[#B28B5D]/15 text-[#B28B5D]" }
                : expired
                ? { label: "Expired", cls: "bg-red-100 text-red-600" }
                : { label: "Active", cls: "bg-green-100 text-green-700" };

              return (
                <tr key={v.id} className="border-b border-[#F5F0E6] hover:bg-[#FAF8F4]">
                  <td className="px-5 py-4 font-mono text-[13px] text-[#3E4F56]">{v.code || "—"}</td>
                  <td className="px-5 py-4 text-[#3E4F56]">£{v.amountPence / 100}</td>
                  <td className="px-5 py-4">
                    <div className="text-[#3E4F56]">{v.purchaserName}</div>
                    <div className="text-[11px] text-[#A09687]">{v.purchaserEmail}</div>
                  </td>
                  <td className="px-5 py-4 text-[#A09687]">
                    {v.recipientName || v.recipientEmail ? (
                      <>
                        <div className="text-[#3E4F56]">{v.recipientName || "—"}</div>
                        {v.recipientEmail && (
                          <div className="text-[11px] text-[#A09687]">{v.recipientEmail}</div>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full ${status.cls}`}>
                      {status.label}
                    </span>
                    {v.redeemedBookingRef && (
                      <div className="text-[11px] text-[#A09687] mt-1">{v.redeemedBookingRef}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[#A09687]">
                    {new Date(v.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
