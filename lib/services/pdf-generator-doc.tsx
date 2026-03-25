import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    renderToBuffer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        padding: 48,
        backgroundColor: '#ffffff',
    },
    coverPage: {
        fontFamily: 'Helvetica',
        padding: 48,
        backgroundColor: '#1a0a2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverBrand: { fontSize: 14, color: '#ff36a2', letterSpacing: 4, marginBottom: 32 },
    coverTitle: { fontSize: 32, color: '#ffffff', fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 16 },
    coverSubtitle: { fontSize: 14, color: '#cccccc', textAlign: 'center', marginBottom: 48 },
    coverMeta: { fontSize: 11, color: '#999999', textAlign: 'center' },
    sectionTitle: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: '#1a0a2e', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #ff36a2' },
    scoreBox: { backgroundColor: '#fef3f8', borderRadius: 8, padding: 24, marginBottom: 24, alignItems: 'center' },
    scoreNumber: { fontSize: 64, fontFamily: 'Helvetica-Bold', color: '#ff36a2', textAlign: 'center' },
    scoreLabel: { fontSize: 14, color: '#666666', textAlign: 'center', marginTop: 4 },
    tierBadge: { backgroundColor: '#ff36a2', borderRadius: 4, paddingHorizontal: 12, paddingVertical: 4, marginTop: 12 },
    tierText: { color: '#ffffff', fontSize: 12, fontFamily: 'Helvetica-Bold' },
    categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottom: '1px solid #f0f0f0' },
    categoryName: { fontSize: 13, color: '#333333', flex: 1 },
    categoryScore: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#ff36a2', width: 60, textAlign: 'right' },
    segmentBox: { backgroundColor: '#f8f9ff', borderRadius: 8, padding: 20, marginBottom: 20, borderLeft: '4px solid #ff36a2' },
    segmentName: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#1a0a2e', marginBottom: 8 },
    segmentReason: { fontSize: 12, color: '#555555', lineHeight: 1.6 },
    ctaBox: { backgroundColor: '#ff36a2', borderRadius: 8, padding: 24, alignItems: 'center', marginTop: 32 },
    ctaText: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 8 },
    ctaUrl: { fontSize: 12, color: '#ffccdd' },
    bodyText: { fontSize: 12, color: '#444444', lineHeight: 1.6, marginBottom: 12 },
    footer: { position: 'absolute', bottom: 24, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between' },
    footerText: { fontSize: 9, color: '#999999' },
});

export interface ReportData {
    leadName: string;
    leadEmail: string;
    funnelName: string;
    totalScore: number;
    maxScore: number;
    tier: string;
    categoryScores: Record<string, number>;
    categoryMaxScores: Record<string, number>;
    segmentName: string;
    decisionReason: string;
    ctaLabel: string;
    ctaUrl: string;
    generatedAt: string;
}

function CoverPage({ data }: { data: ReportData }) {
    return (
        <Page size="A4" style={styles.coverPage}>
            <Text style={styles.coverBrand}>RENEN</Text>
            <Text style={styles.coverTitle}>Your Personalized{'\n'}Assessment Report</Text>
            <Text style={styles.coverSubtitle}>{data.funnelName}</Text>
            <Text style={styles.coverMeta}>Prepared for: {data.leadName}</Text>
            <Text style={styles.coverMeta}>{data.leadEmail}</Text>
            <Text style={[styles.coverMeta, { marginTop: 8 }]}>{data.generatedAt}</Text>
        </Page>
    );
}

function ScoreSummaryPage({ data }: { data: ReportData }) {
    const percentage = data.maxScore > 0 ? Math.round((data.totalScore / data.maxScore) * 100) : 0;
    return (
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Your Score Summary</Text>
            <View style={styles.scoreBox}>
                <Text style={styles.scoreNumber}>{data.totalScore}</Text>
                <Text style={styles.scoreLabel}>out of {data.maxScore} points ({percentage}%)</Text>
                <View style={styles.tierBadge}>
                    <Text style={styles.tierText}>{data.tier}</Text>
                </View>
            </View>
            <View style={styles.segmentBox}>
                <Text style={styles.segmentName}>{data.segmentName}</Text>
                <Text style={styles.segmentReason}>{data.decisionReason}</Text>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>RENEN Assessment Report</Text>
                <Text style={styles.footerText}>{data.generatedAt}</Text>
            </View>
        </Page>
    );
}

function CategoryPage({ data }: { data: ReportData }) {
    const categories = Object.entries(data.categoryScores);
    return (
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Category Breakdown</Text>
            {categories.map(([name, score]) => {
                const max = data.categoryMaxScores[name] ?? 100;
                return (
                    <View key={name} style={styles.categoryRow}>
                        <Text style={styles.categoryName}>{name}</Text>
                        <Text style={styles.categoryScore}>{score}/{max}</Text>
                    </View>
                );
            })}
            <View style={styles.footer}>
                <Text style={styles.footerText}>RENEN Assessment Report</Text>
                <Text style={styles.footerText}>Page 3</Text>
            </View>
        </Page>
    );
}

function NextStepsPage({ data }: { data: ReportData }) {
    return (
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Your Next Steps</Text>
            <Text style={styles.bodyText}>
                Based on your assessment results, your score of {data.totalScore} places you in the &quot;{data.tier}&quot; tier.
            </Text>
            <Text style={styles.bodyText}>{data.decisionReason}</Text>
            <Text style={[styles.sectionTitle, { marginTop: 24, fontSize: 16 }]}>Ready to Take Action?</Text>
            <View style={styles.ctaBox}>
                <Text style={styles.ctaText}>{data.ctaLabel}</Text>
                {data.ctaUrl ? <Text style={styles.ctaUrl}>{data.ctaUrl}</Text> : null}
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>RENEN Assessment Report — Confidential</Text>
                <Text style={styles.footerText}>{data.generatedAt}</Text>
            </View>
        </Page>
    );
}

function ReportDocument({ data }: { data: ReportData }) {
    return (
        <Document title={`RENEN Report — ${data.leadName}`} author="RENEN">
            <CoverPage data={data} />
            <ScoreSummaryPage data={data} />
            <CategoryPage data={data} />
            <NextStepsPage data={data} />
        </Document>
    );
}

export async function generatePDF(data: ReportData): Promise<Buffer> {
    const buffer = await renderToBuffer(<ReportDocument data={data} />);
    return buffer;
}
