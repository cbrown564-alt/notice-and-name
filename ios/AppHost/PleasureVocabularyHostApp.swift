import SwiftUI
import PleasureVocabularyApp

@main
struct PleasureVocabularyHostApp: App {
    init() {
        AppTheme.configure()
    }

    var body: some Scene {
        WindowGroup {
            PleasureVocabularyRootView()
        }
    }
}
