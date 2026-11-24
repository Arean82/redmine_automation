module AutomationNodes
  module Conditions
    # Evaluates a "related items" condition: collects the related issues of the
    # current issue and checks them against a criterion (presence, count, or an
    # RQL expression).
    #
    # related_items: parent | current | subtasks | linked | created
    # condition:
    #   arePresent / areNotPresent            presence of related issues
    #   exists / notExists                    alias of presence checks
    #   countEquals / areGreaterThan / areLessThan   compare count to `count`
    #   matchRql / doNotMatchRql / atLeastOneMatchesRql   evaluate `query` per item
    class RelatedItemsService < ::AutomationService
      RQL_OPERATORS = ["!=", ">=", "<=", "==", "=", ">", "<", "contains", "in"].freeze

      def call
        evaluate ? success(message: node_message(:success)) : skipped(message: node_message(:skipped))
      end

      private

      def evaluate
        items = related_entities
        count = node.count.to_i

        case node.condition
        when "arePresent", "exists"
          items.any?
        when "areNotPresent", "notExists"
          items.none?
        when "countEquals"
          items.size == count
        when "areGreaterThan"
          items.size > count
        when "areLessThan"
          items.size < count
        when "matchRql", "atLeastOneMatchesRql"
          items.any? { |item| rql_match?(item) }
        when "doNotMatchRql"
          items.none? { |item| rql_match?(item) }
        else
          false
        end
      end

      def related_entities
        case node.related_items
        when "parent"
          entity.parent ? [entity.parent] : []
        when "current"
          [entity]
        when "subtasks"
          entity.children.to_a
        when "linked"
          entity.relations.map { |r| r.other_issue(entity) }.compact
        when "created"
          created = prev_result.data[:created]
          created ? [created].flatten : []
        else
          []
        end
      end

      def rql_match?(issue)
        return false if node.query.blank?

        operator = RQL_OPERATORS.find { |op| node.query.include?(op) }
        return false unless operator

        left, right = node.query.split(operator, 2).map(&:strip)
        left_value = resolve_operand(left, issue)
        right_value = resolve_operand(right, issue)
        compare(left_value, operator, right_value)
      end

      def resolve_operand(operand, issue)
        operand = operand.to_s.strip
        if operand.start_with?("{{") && operand.end_with?("}}")
          resolve_token_for(operand[2..-3], issue)
        else
          operand
        end
      end

      def resolve_token_for(token, issue)
        context = { issue: issue, initiator: pipeline.author, today: Date.today, now: DateTime.now }
        RedmineAutomation::Tokens::Processor.resolve_token(token, context) || token
      end

      def compare(left, operator, right)
        case operator
        when "=", "=="
          left.to_s == right.to_s
        when "!="
          left.to_s != right.to_s
        when ">"
          left.to_f > right.to_f
        when ">="
          left.to_f >= right.to_f
        when "<"
          left.to_f < right.to_f
        when "<="
          left.to_f <= right.to_f
        when "contains"
          left.to_s.include?(right.to_s)
        when "in"
          right.to_s.split(",").map(&:strip).include?(left.to_s)
        else
          false
        end
      end
    end
  end
end
