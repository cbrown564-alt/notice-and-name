import XCTest
@testable import PleasureVocabularyApp

final class LocalExportFileTests: XCTestCase {
    func testFilenameUsesLondonCalendarDay() {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Europe/London")!
        let date = calendar.date(from: DateComponents(year: 2026, month: 8, day: 17, hour: 9, minute: 26))!
        XCTAssertEqual(
            LocalExportFile.filename(for: date),
            "notice-and-name-export-2026-08-17.json"
        )
    }
}
