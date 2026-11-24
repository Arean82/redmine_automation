require 'stringio'

module AutomationNodes
  module Actions
    class AddAttachmentService < ::AutomationService
      # Attaches a file to the current issue. The file content is either the
      # literal `content` (with token replacement) or downloaded from `url`.
      def call
        filename = replace_tokens(node.filename).presence || 'attachment.txt'
        content = prepare_content

        file = UploadedContent.new(content.to_s, filename)
        entity.save_attachments(
          [{ 'file' => file, 'filename' => filename }],
          automation_user
        )

        success(message: node_message(:success, filename: filename))
      end

      private

      def prepare_content
        if node.url.present?
          response = HTTParty.get(replace_tokens(node.url))
          response.body.to_s
        else
          replace_tokens(node.content).to_s
        end
      end

      # Minimal file-like object understood by Redmine's save_attachments.
      UploadedContent = Struct.new(:content, :filename) do
        def read
          content
        end

        def size
          content.to_s.bytesize
        end

        def original_filename
          filename
        end

        def content_type
          'text/plain'
        end

        def rewind
        end
      end
    end
  end
end
