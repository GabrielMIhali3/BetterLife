from domain.ScanHistory import ScanHistory
from DTO.ScanHistoryDTO import ScanHistoryDTO

class ScanHistoryMapper:
    @staticmethod
    def mapToScanHistoryDTO(scanHistory: ScanHistory) -> ScanHistoryDTO:
        """Scans a ScanHistory to a ScanHistoryDTO"""
        return ScanHistoryDTO(
            scanHistory.id,
            scanHistory.user_id,
            scanHistory.product_id,
            scanHistory.scanned_at,
            scanHistory.purchased,
            scanHistory.price
        )

    @staticmethod
    def mapToScanHistory(scanHistoryDTO: ScanHistoryDTO) -> ScanHistory:
        """Maps a ScanHistoryDTO to a ScanHistory"""
        scanHistory = ScanHistory(scanHistoryDTO.user_id, scanHistoryDTO.product_id, scanHistoryDTO.scanned_at, scanHistoryDTO.purchased, scanHistoryDTO.price)
        scanHistory.id = scanHistoryDTO.id
        return scanHistory
