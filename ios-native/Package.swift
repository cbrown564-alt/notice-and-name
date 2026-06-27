// swift-tools-version: 6.0

import PackageDescription

let package = Package(
    name: "PleasureVocabularyNative",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "PleasureVocabularyCore",
            targets: ["PleasureVocabularyCore"]
        ),
        .library(
            name: "PleasureVocabularyApp",
            targets: ["PleasureVocabularyApp"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "PleasureVocabularyCore",
            dependencies: [
                .product(name: "GRDB", package: "GRDB.swift")
            ]
        ),
        .target(
            name: "PleasureVocabularyApp",
            dependencies: ["PleasureVocabularyCore"],
            resources: [
                .process("Resources")
            ]
        ),
        .testTarget(
            name: "PleasureVocabularyCoreTests",
            dependencies: ["PleasureVocabularyCore"]
        )
    ]
)
