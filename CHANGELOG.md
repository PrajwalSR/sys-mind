# Changelog

All notable changes to SysMind will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - December 2024

#### Cloud Provider Integration
- **Mandatory Cloud Provider Selection**: All dynamic forms now include cloud provider (AWS/GCP/Azure) as the first required field
- **Form Validation**: Client-side validation in `DynamicForm.tsx` prevents submission without cloud provider selection
- **State Management**: Cloud provider extracted from form submissions and tracked throughout the session in `app/page.tsx`
- **Cloud-Specific Icons**: Diagrams automatically use the correct cloud provider icon libraries based on user selection
- **Smart Normalization**: Cloud provider values normalized to 'aws', 'gcp', or 'azure' for consistent usage

#### Comprehensive Requirement Gathering
- **Enhanced Form Questions**: Forms expanded from 3 fields to 5-7 comprehensive fields
- **Category Coverage**: Forms now cover all critical aspects:
  - Cloud Provider (always first)
  - Scale/Volume (users, traffic, data size)
  - Key Features/Functionality
  - Geographic Distribution (regions)
  - Performance Requirements (latency, quality)
  - Special Requirements (compliance, security, analytics)
- **Updated Examples**:
  - URL Shortener: 6 fields (cloud_provider, num_redirects, num_urls, geographic_coverage, custom_alias, analytics_required)
  - Netflix: 7 fields (cloud_provider, concurrent_users, video_quality, regions, content_library_size, encoding_requirements, drm_required)
  - Instagram: Already had 6 fields, maintained
- **Improved AI Instructions**: ARCHITECT_PROMPT strengthened to emphasize asking ALL questions upfront with NO follow-ups

#### Robust Diagram Generation & Error Recovery
- **Increased Retry Limit**: Retry attempts increased from 1 to 3 for diagram generation failures
- **Fix Validation**: Added validation logic to ensure fixes actually resolve issues before accepting them
- **Progressive Fallback**: After 3 failed attempts, offers user a text-based architecture description as alternative
- **Retry Progress UI**: Visual feedback in `DiagramPanel.tsx` showing "Auto-fixing errors (Attempt X/3)"
- **Smart Retry Logic**: Automatic retry on validation failures with proper state management
- **Success Reset**: Retry counter automatically resets on successful diagram generation or fix

### Changed

#### Component Updates
- **DynamicForm.tsx**: Added cloud provider validation in `handleSubmit` function
- **ChatPanel.tsx**: Updated `handleFormSubmit` to extract and pass cloud provider to parent
- **DiagramPanel.tsx**: Added `retryCount` prop and updated regenerating overlay UI
- **app/page.tsx**:
  - Updated `handleSendMessage` signature to accept optional `cloudProvider` parameter
  - Enhanced `handleFixDiagram` with validation and progressive fallback
  - Added new `handleRequestTextArchitecture` function for text-based fallback
- **lib/systemPrompt.ts**:
  - Strengthened ARCHITECT_PROMPT instructions
  - Updated all three example forms (URL Shortener, Instagram, Netflix)
  - Added comprehensive question categories

#### Documentation
- **README.md**:
  - Updated to reflect Solution Mode as default
  - Added "Recent Improvements" section
  - Updated Tech Stack to Next.js 16, React 19, draw.io
  - Enhanced feature descriptions with new capabilities
  - Marked Interview and Review modes as "Coming Soon"
- **CHANGELOG.md**: Created to track version history

### Technical Details

#### Files Modified
1. `lib/systemPrompt.ts` - Enhanced prompts and examples
2. `app/page.tsx` - Cloud provider state management, retry logic, validation
3. `components/DynamicForm.tsx` - Form validation
4. `components/ChatPanel.tsx` - Cloud provider extraction
5. `components/DiagramPanel.tsx` - Retry progress UI
6. `README.md` - Documentation updates
7. `CHANGELOG.md` - Created (this file)

#### Breaking Changes
None - All changes are backward compatible and additive.

#### Migration Notes
- No migration required
- Existing functionality preserved
- New features activate automatically

---

## [Previous Versions]

### Earlier Development
- Initial implementation with Interview, Solution, and Review modes
- Integration with Google Vertex AI (Gemini)
- Dynamic form system implementation
- draw.io diagram integration
- Live whiteboard functionality
- Session persistence with Supabase (optional)
